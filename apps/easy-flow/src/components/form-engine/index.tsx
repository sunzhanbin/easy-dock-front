import React, { memo, useEffect, useMemo, useState } from 'react';
import { Col, Form, FormInstance, Row } from 'antd';
import classNames from 'classnames';
import { Rule } from 'antd/lib/form';
import useLoadComponents from '@/hooks/use-load-components';
import { AllComponentType, Datasource, EventType, FormRuleItem } from '@type';
import { AuthType, FieldAuthsMap } from '@type/flow';
import { FormMeta, FormValue } from '@type/detail';
import { analysisFormChangeRule, runtimeAxios } from '@/utils';
import LabelContent from '../label-content';
import styles from './index.module.scss';
import { Loading } from '@common/components';
import { DataConfig, ParamSchem } from '@/type/api';
import PubSub from 'pubsub-js';
import Container from './container';
import { convertFormRules, validateRules } from './utils';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { debounce, omit } from 'lodash';
import { getFilesType } from '@apis/form';

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormMeta;
  fieldsAuths: any;
  initialValue: { [key: string]: any };
  datasource: Datasource;
  readonly?: boolean;
  className?: string;
  projectId?: number;
  nodeType: string;
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

export const getFilesTypeList = async () => {
  try {
    const ret = await getFilesType();
    const fileMap: { [key: string]: string[] } = {};
    ret.data.forEach((item: { code: string; suffixes: string[] }) => {
      fileMap[item.code] = item.suffixes;
    });
    return fileMap;
  } catch (e) {
    console.log(e);
  }
};

const FormDetail = React.forwardRef(function FormDetail(
  props: FormProps,
  ref: React.ForwardedRef<FormInstance<FormValue>>,
) {
  const { data, fieldsAuths, datasource, initialValue, readonly, className, projectId, nodeType = 'start' } = props;
  const [form] = Form.useForm<FormValue>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});
  const [showForm, setShowForm] = useState(false);

  const comRules = useMemo(() => {
    const rules: FormRuleItem[] = data.formRules?.concat(data.propertyRules || []) || [];
    const formRules = convertFormRules(rules, data.components);
    return { formRules };
  }, [data.formRules, data.propertyRules, data.components]);

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

  const callInterfaceList = useMemoCallback((ruleList: DataConfig[], formValues: any) => {
    const formDataList: { name: string; value: any }[] = (Object.keys(formValues) || [])
      .filter((name) => formValues[name] !== undefined)
      .map((name) => {
        return { name, value: formValues[name] };
      });
    // 返回值映射列表
    const respListMap: { fieldName: string; name: string }[][] = [];
    const promiseList: Promise<any>[] = [];
    ruleList.forEach((rule) => {
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
        return formValues[name] === undefined;
      });
      if (isEmpty) {
        return;
      }
      const resMap = ((rule?.response as ParamSchem[]) || []).map((res) => {
        if (!res) {
          return { fieldName: '', name: '' };
        }
        const { name, map: fieldName = '' } = res;
        return { fieldName, name };
      });
      respListMap.push(resMap);
      promiseList.push(runtimeAxios.post('/common/doHttpJson', { meta: rule, formDataList }));
    });
    setLoading(true);
    Promise.all(promiseList)
      .then((resList) => {
        const formValues: { [k: string]: any } = {};
        resList.forEach((res, index) => {
          respListMap[index].forEach(({ fieldName, name }) => {
            if (fieldName && name) {
              // TODO 替换eval
              // eslint-disable-next-line
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
  });

  useEffect(() => {
    // 进入表单时请求接口
    if (initRuleList.length > 0) {
      callInterfaceList(initRuleList, initialValue);
    }
  }, [initRuleList, initialValue, callInterfaceList]);

  const interfaceRules = useMemo(() => {
    return (data.formRules?.filter((v) => v.subtype === EventType.Interface) || []).map((v) => {
      const condition = v.formChangeRule?.fieldRule || [];
      const interfaceConfig = v.formChangeRule?.interfaceConfig;
      const watchList = [
        ...(new Set(
          condition
            .flat(2)
            .filter(Boolean)
            .map((item: any) => item.fieldName),
        ) as any),
      ];
      return { condition, watchList, interfaceConfig };
    });
  }, [data.formRules]);

  const handleCallInterface = useMemoCallback(
    debounce((key: string) => {
      if (interfaceRules.length === 0) {
        return;
      }
      const formValues = form.getFieldsValue();
      if (formValues[key] === undefined) {
        return;
      }
      const interfaceList = interfaceRules
        .filter(({ condition, watchList }) => {
          if (watchList.includes(key)) {
            if (!Array.isArray(condition)) return null;
            return analysisFormChangeRule(condition, formValues);
          }
          return null;
        })
        .map((v) => v.interfaceConfig!);
      if (interfaceList?.length === 0) {
        return;
      }
      callInterfaceList(interfaceList, formValues);
    }, 500),
  );

  const onValuesChange = useMemoCallback((changeValue: any, all: any) => {
    // 此处不要进行setState操作   避免重复更新
    Object.entries(changeValue).forEach(([key, value]: any) => {
      // tabs components
      if (value && Array.isArray(value) && value.length && all?.[key]?.[0]?.['__title__']) {
        const field = value[value.length - 1];
        if (field && typeof field === 'object') {
          const changeKey = Object.keys(field)[0];
          const changeValue = Object.values(field)[0];
          if (!changeKey) return;
          PubSub.publish(`${key}.${changeKey}-change`, changeValue);
          // emit tabs-sub-components visible event
          PubSub.publish(`${changeKey}-change`, changeValue);
        }
      } else {
        PubSub.publish(`${key}-change`, value);
      }
      handleCallInterface(key);
    });
  });

  useEffect(() => {
    const visbles: FieldsVisible = {};
    const comMaps: { [key: string]: FormMeta['components'][number] } = {};
    const formValues: FormProps['initialValue'] = {};
    (async () => {
      if (componentTypes.includes('Attachment')) {
        const fileMap = await getFilesTypeList();
        data.components.forEach((comp) => {
          if (comp.config.type === 'Attachment') {
            comp.props.fileMap = fileMap;
          }
        });
      }
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
        if (!visbles[key]) {
          hiddenFieldMap[key] = false;
        }
      });
      // 设置字段可见性, 不能和下面代码交互执行顺序
      setFieldsVisible(visbles);
      setCompMaps(comMaps);
      setShowForm(true);

      // 不是开始节点的话，需要一进来就走一遍表单逻辑规则
      setTimeout(() => {
        if (nodeType !== 'start') {
          Object.entries(formValues)
            .filter(([key, value]: [string, any]) => value !== undefined)
            .forEach(([key, value]) => {
              onValuesChange({ [key]: value }, formValues);
            });
        }
      }, 18);
    })();
  }, [data, fieldsAuths, initialValue, form, componentTypes, nodeType, onValuesChange]);

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
              const { colSpace = 4, label = '', desc = '', type = '', id } = config;
              const fieldName = config.fieldName || props.fieldName || '';
              const isRequired = fieldsAuths && fieldsAuths[fieldName] === AuthType.Required;
              const compProps = { ...props };
              const Component = compSources[config?.type as AllComponentType['type']];
              if (!fieldsVisible[config.fieldName || fieldId] || !Component) return null;
              if (type === 'DescText' && compProps.value) {
                compProps['text_value'] = compProps.value;
              }
              delete compProps['defaultValue'];
              delete compProps['apiConfig'];
              const rules: Rule[] = validateRules(isRequired, label, type, props);
              return (
                <Col span={colSpace * 6} key={fieldId} className={styles.col}>
                  {/* 由于预览时没有fieldName字段  此处统一用id*/}
                  <Container
                    type={config.type}
                    fieldName={fieldName || id}
                    form={form}
                    rules={comRules.formRules[fieldName || id]}
                    nodeType={nodeType!}
                  >
                    <Form.Item
                      key={fieldId}
                      name={fieldName || fieldId}
                      label={type !== 'DescText' ? <LabelContent label={label} desc={desc} /> : null}
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
      <Component
        {...props}
        fieldName={fieldName}
        auth={fieldsAuths}
        readonly={readonly}
        formInstance={formInstance}
        projectId={projectId}
      />
    );
  }
  return <Component {...props} />;
}
