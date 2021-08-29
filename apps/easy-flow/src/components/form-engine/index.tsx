import React, { memo, useEffect, useState, useMemo } from 'react';
import { Form, Row, Col, FormInstance } from 'antd';
import { Rule } from 'antd/lib/form';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useLoadComponents from '@/hooks/use-load-components';
import { AllComponentType, Datasource, fieldRule, FormChangeRule } from '@type';
import { FieldAuthsMap, AuthType } from '@type/flow';
import { FormMeta, FormValue } from '@type/detail';
import { analysisFormChangeRule } from '@/utils';
import LabelContent from '../label-content';
import styles from './index.module.scss';

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormMeta;
  fieldsAuths: FieldAuthsMap;
  initialValue: { [key: string]: any };
  readonly?: boolean;
  datasource: Datasource;
}

type CompMaps = {
  [componentId: string]: FormMeta['components'][number];
};

const FormDetail = React.forwardRef(function FormDetail(
  props: FormProps,
  ref: React.ForwardedRef<FormInstance<FormValue>>,
) {
  const { data, fieldsAuths, datasource, initialValue, readonly } = props;
  const [form] = Form.useForm<FormValue>();
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});
  const [showForm, setShowForm] = useState(false);

  const changeRuleList = useMemo<(FormChangeRule & { hasChanged: boolean })[]>(() => {
    if (!data.formRules) {
      return [];
    }
    return data.formRules
      .filter((rule) => rule.type === 'change')
      .map((rule) => rule.formChangeRule)
      .map((rule) => Object.assign({}, rule, { hasChanged: false }));
  }, [data.formRules]);
  // 值改变规则依赖的字段列表,若表单change的字段不在依赖列表中则不需要进行校验
  const changeFieldList = useMemo<string[]>(() => {
    if (changeRuleList.length === 0) {
      return [];
    }
    const fieldRuleList: fieldRule[][][] = [];
    changeRuleList.forEach((rule) => {
      fieldRuleList.push(rule.fieldRule);
    });
    const list = fieldRuleList
      .filter((item) => item)
      .flat(3)
      .map((rule) => rule.fieldName);
    const set = new Set(list);
    return Array.from(set);
  }, [changeRuleList]);
  // 缓存之前的表单控件显隐状态
  const cacheFieldsVisibleMap = useMemo(() => {
    const map: { [k in number]: FieldsVisible } = {};
    changeRuleList.forEach((rule, index) => {
      map[index] = {};
    });
    return map;
  }, [changeRuleList]);

  // 提取所有组件类型
  const componentTypes = useMemo(() => {
    return data.components.map((comp) => comp.config.type);
  }, [data]);

  // 数据库字段名和控件id映射
  const fieldNameMap = useMemo(() => {
    const map: { [k in string]: string } = {};
    data.components.forEach((comp) => {
      map[comp.config.fieldName] = comp.config.id;
    });
    return map;
  }, [data]);
  const componentIdMap = useMemo(() => {
    const map: { [k in string]: string } = {};
    data.components.forEach((comp) => {
      map[comp.config.id] = comp.config.fieldName;
    });
    return map;
  }, [data]);

  // 获取组件源码
  const compSources = useLoadComponents(componentTypes);
  const formValuesChange = useMemoCallback((changedValues: FormValue) => {
    // 处理单个控件绑定的事件
    if (data.events && data.events.onchange) {
      // 处理响应表单事件，响应绑定的visible和reset
      data.events.onchange.forEach((event) => {
        const { fieldId, listeners, value } = event;
        const { visible, reset } = listeners;

        // 处理visible
        if (fieldId in changedValues && visible && visible.length) {
          const fieldsVisible: FieldsVisible = {};

          visible.forEach((id) => {
            fieldsVisible[id] = changedValues[fieldId] === value;
          });

          setFieldsVisible((oldVisible) => Object.assign({}, oldVisible, fieldsVisible));
        }

        // 处理reset
        if (changedValues[fieldId] === value) {
          if (reset && reset.length) {
            const fiieldsResetValues: { [key: string]: undefined } = {};

            reset.forEach((id) => {
              fiieldsResetValues[id] = undefined;
            });

            form.setFieldsValue(fiieldsResetValues);
          }
        }
      });
    }
    const formValues = form.getFieldsValue();
    const changedFieldName = Object.keys(changedValues).length > 0 ? Object.keys(changedValues)[0] : '';
    // 处理表单属性值改变时事件
    if (changeRuleList.length > 0 && Object.keys(formValues).length > 0 && changeFieldList.includes(changedFieldName)) {
      changeRuleList.forEach((rule, index) => {
        const result = analysisFormChangeRule(rule!.fieldRule, formValues);
        const showComponents = rule?.showComponents || [];
        const hideComponents = rule?.hideComponents || [];
        if (result) {
          const fieldVisible: FieldsVisible = {};
          showComponents.forEach((id) => {
            id.startsWith('DescText') ? (fieldVisible[id] = true) : (fieldVisible[componentIdMap[id]] = true);
          });
          hideComponents.forEach((id) => {
            id.startsWith('DescText') ? (fieldVisible[id] = false) : (fieldVisible[componentIdMap[id]] = false);
          });
          setFieldsVisible((oldVisible) => {
            const visible: FieldsVisible = {};
            Object.keys(fieldVisible).forEach((key) => {
              visible[key] = !fieldVisible[key];
            });
            cacheFieldsVisibleMap[index] = { ...visible };
            const result = Object.assign({}, oldVisible, fieldVisible);
            return result;
          });
          rule.hasChanged = true;
        } else {
          if (rule.hasChanged) {
            setFieldsVisible((oldVisible) => {
              const cacheFieldVisible = cacheFieldsVisibleMap[index];
              const result = Object.assign({}, oldVisible, cacheFieldVisible);
              return result;
            });
            rule.hasChanged = false;
          }
        }
      });
    }
  });

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
      visbles[fieldName || id] = fieldsAuths[fieldName || id] !== AuthType.Denied;
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
    // 设置完初始值后设置当前字段可见状态
    formValuesChange(formValues);

    setShowForm(true);
  }, [data, fieldsAuths, initialValue, form, formValuesChange]);

  return (
    <Form
      className={styles.form}
      ref={ref}
      form={form}
      layout="vertical"
      autoComplete="off"
      onValuesChange={formValuesChange}
    >
      {data.layout.map((formRow, index) => {
        // 空行或者所用组件未加载不渲染
        if (!formRow.length || !showForm || !compSources) return null;

        return (
          <Row key={index} className={styles.row}>
            {formRow.map((fieldId) => {
              const { config = {}, props = {} } = compMaps[fieldId];
              const { fieldName = '', colSpace = '', label = '', desc = '', type = '' } = config;
              const isRequired = fieldsAuths[fieldName] === AuthType.Required;
              const compProps = { ...props };
              const Component = compSources[config?.type as AllComponentType['type']];

              if (!fieldsVisible[fieldName || fieldId] || !Component) return null;

              delete compProps['defaultValue'];

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
                      datasource && (datasource[fieldName] || datasource[fieldId]),
                    )}
                  </Form.Item>
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

function compRender(
  type: AllComponentType['type'],
  Component: any,
  props: any,
  datasource?: Datasource[keyof Datasource],
) {
  if ((type === 'Select' || type === 'Radio' || type === 'Checkbox') && datasource) {
    return <Component {...props} options={datasource} />;
  }

  return <Component {...props} />;
}
