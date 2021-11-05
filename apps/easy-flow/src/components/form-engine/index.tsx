import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { Col, Form, FormInstance, Row } from 'antd';
import classNames from 'classnames';
import { Rule } from 'antd/lib/form';
import useLoadComponents from '@/hooks/use-load-components';
import { AllComponentType, Datasource } from '@type';
import { AuthType, FieldAuthsMap } from '@type/flow';
import { FormMeta, FormValue } from '@type/detail';
import { runtimeAxios } from '@/utils';
import LabelContent from '../label-content';
import styles from './index.module.scss';
import { Loading } from '@common/components';
import { DataConfig, ParamSchem } from '@/type/api';
import _ from 'lodash';
import PubSub from 'pubsub-js';
import Container from './container';
import {convertFormRules} from './utils';

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormMeta;
  fieldsAuths: any;
  initialValue: { [key: string]: any };
  readonly?: boolean;
  className?: string;
  projectId?: number;
  datasource: Datasource;
}

type CompMaps = {
  [componentId: string]: FormMeta['components'][number];
};

type ExtendProps = {
  datasource: Datasource[keyof Datasource];
  fieldName: string;
  fieldsAuths: FieldAuthsMap;
  formInstance?: FormInstance;
  projectId?: number;
  readonly?: boolean;
};

export type ConfigMap = {
  [key: string]: {
    [key: string]: any;
    name?: string;
    tableData?: { [key: string]: any }[];
  };
};

const FormDetail = React.forwardRef(function FormDetail(
  props: FormProps,
  ref: React.ForwardedRef<FormInstance<FormValue>>,
) {
  const { data, fieldsAuths, datasource, initialValue, readonly, className, projectId } = props;
  const [form] = Form.useForm<FormValue>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});
  const [showForm, setShowForm] = useState(false);

  const comRules = useMemo(() => {
    const formRules = convertFormRules(data.formRules, data.components);
    return {
      formRules
    }
  }, [data.formRules, data.components]);

  const initRuleList = useMemo<DataConfig[]>(() => {
    if (!data.formRules) {
      return [];
    }
    return data.formRules.filter((rule) => rule.type === 'init').map((rule) => rule.formInitRule as DataConfig);
  }, [data.formRules]);

  // 提取所有组件类型
  const componentTypes = useMemo(() => {
    return data.components.map((comp) => comp.config.type);
  }, [data]);
  // 获取组件源码
  const compSources = useLoadComponents(componentTypes);

  useEffect(() => {
    const visbles: FieldsVisible = {};
    const comMaps: { [key: string]: FormMeta['components'][number] } = {};
    const formValues: FormProps['initialValue'] = {};
    data.components.forEach((com) => {
      const { fieldName, id } = com.config;

      if (initialValue && initialValue[fieldName] !== undefined) {
        formValues[fieldName] = initialValue[fieldName];
      } else {
        formValues[fieldName || id] = com.props.defaultValue || com.config.value;
      }

      comMaps[id] = com;
      // 流程编排中没有配置fieldAuths这个字段默认可见
      visbles[fieldName || id] = fieldsAuths && fieldsAuths[fieldName || id] !== AuthType.Denied;
    });
    // 设置表单初始值
    form.setFieldsValue(formValues);
    const hiddenFieldMap: FieldsVisible = {};
    Object.keys(visbles).forEach((key) => {
      if (visbles[key] === false) {
        hiddenFieldMap[key] = false;
      }
    });
    // 设置字段可见性, 不能和下面代码交互执行顺序
    setFieldsVisible(visbles);

    setCompMaps(comMaps);

    setShowForm(true);
  }, [data, fieldsAuths, initialValue, form]);

  useEffect(() => {
    // 进入表单时请求接口
    if (initRuleList.length > 0) {
      const formDataList: { name: string; value: any }[] = (Object.keys(initialValue) || []).map((name) => {
        return { name, value: initialValue[name] };
      });
      // 返回值映射列表
      const respListMap: { fieldName: string; name: string }[][] = [];
      const promiseList: Promise<any>[] = [];
      initRuleList.forEach((rule, index) => {
        const requestMapList = rule.request.required
          .concat(rule.request.customize)
          .map((item) => {
            const { map } = item;
            if (!map) {
              return '';
            }
            return String(map?.match(/(?<=\$\{).*?(?=\})/));
          })
          .filter((name) => name !== 'null' && name !== '');
        // 只要接口关联表单值得参数中有一个没有值就不请求接口
        const isEmpty = requestMapList.some((name) => {
          return initialValue[name] === undefined;
        });
        if (isEmpty) {
          return;
        }
        const resMap = ((rule?.response as ParamSchem[]) || []).map((res) => {
          if (!res) {
            return { fieldName: '', name: '' };
          }
          const { name, map } = res;
          const fieldName = String(map?.match(/(?<=\$\{).*?(?=\})/));
          return { fieldName, name };
        });
        respListMap.push(resMap);
        promiseList.push(runtimeAxios.post('/common/doHttpJson', { jsonObject: rule, formDataList }));
      });
      setLoading(true);
      Promise.all(promiseList)
        .then((resList) => {
          const formValues: { [k: string]: any } = {};
          resList.forEach((res, index) => {
            respListMap[index].forEach(({ fieldName, name }) => {
              if (fieldName && name) {
                // TODO 替换eval
                formValues[fieldName] = eval(`res.${name}`);
              }
            });
          });
          form.setFieldsValue(formValues);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [form, initRuleList, initialValue]);

  const onValuesChange = useCallback((changeValue: any) => {
    // formValuesChange(changeValue);
    console.log(changeValue, 'change')
    Object.entries(changeValue).map(([key, value]: any,) => {
      PubSub.publish(`${key}-change`, value);
    })
  }, [])

  return (
    <Form
      className={classNames(styles.form, className)}
      ref={ref}
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      {loading && <Loading />}
      {data.layout.map((formRow, index) => {
        // 空行或者所用组件未加载不渲染
        if (!formRow.length || !showForm || !compSources) return null;
        return (
          <Row key={index} className={styles.row}>
            {formRow.map((fieldId) => {
              const { config = {}, props = {} } = compMaps[fieldId];
              const { fieldName = '', colSpace = '', label = '', desc = '', type = '', flows = {} } = config;
              const isRequired = fieldsAuths && fieldsAuths[fieldName] === AuthType.Required;
              const compProps = { ...props };
              const Component = compSources[config?.type as AllComponentType['type']];
              if (!fieldsVisible[fieldName || fieldId] || !Component) return null;
              delete compProps['defaultValue'];
              delete compProps['apiConfig'];
              let rules: Rule[] = [];
              if (isRequired) {
                rules = [
                  {
                    required: true,
                    message: `${label}不能为空`,
                  },
                ];
              }
              return (
                <Col span={colSpace * 6} key={fieldId} className={styles.col}>
                  <Container 
                    type={config.type} 
                    fieldName={fieldName} 
                    form={form} 
                    rules={comRules.formRules[fieldName]}
                  >
                    <Form.Item

                      key={fieldId}
                      name={fieldName || fieldId}
                      label={type !== 'DescText' ? <LabelContent label={label} desc={desc}/> : null}
                      required={isRequired}
                      rules={rules}
                    >
                      {compRender(
                        config.type,
                        Component,
                        Object.assign({}, compProps, {
                          disabled:
                            readonly ||
                            !(fieldsAuths[fieldName] || fieldsAuths[fieldId]) ||
                            fieldsAuths[fieldName] === AuthType.View,
                          flows,
                        }),
                        {
                          datasource: datasource && (datasource[fieldName] || datasource[fieldId]),
                          formInstance: form,
                          projectId,
                          fieldName,
                          fieldsAuths: fieldsAuths[fieldName],
                          readonly,
                        },
                      )}
                    </Form.Item>
                  </Container>
                </Col>
              );
            })}
          </Row>
        );
      })}
    </Form>
  );
});

export default memo(FormDetail);

function compRender(type: AllComponentType['type'], Component: any, props: any, extendProps: ExtendProps) {
  const { datasource, projectId, fieldName, formInstance, fieldsAuths, readonly } = extendProps;
  if ((type === 'Select' || type === 'Radio' || type === 'Checkbox') && datasource) {
    return <Component {...props} options={datasource} />;
  }
  if (type === 'Member') {
    return <Component {...props} projectid={projectId} />;
  }
  if (type === 'Tabs') {
    return (
      <Component {...props} fieldName={fieldName} auth={fieldsAuths} readonly={readonly} formInstance={formInstance} />
    );
  }
  return <Component {...props} />;
}
