import React, { memo, useEffect, useState, useMemo } from 'react';
import { Form, Row, Col, FormInstance, Select } from 'antd';
import { Rule } from 'antd/lib/form';
import useMemoCallback from '@common/hooks/use-memo-callback';
import useLoadComponents from '@/hooks/use-load-components';
import { AllComponentType, Datasource } from '@type';
import { FieldAuthsMap, AuthType } from '@type/flow';
import { FormMeta, FormValue } from '@type/detail';
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

  // 提取所有组件类型
  const componentTypes = useMemo(() => {
    return data.components.map((comp) => (comp as any).config.type);
  }, [data]);

  // 获取组件源码
  const compSources = useLoadComponents(componentTypes);
  const formValuesChange = useMemoCallback((changedValues: FormValue) => {
    if (!data.events || !data.events.onchange) return;

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
        formValues[fieldName] = com.props.defaultValue;
      }

      comMaps[id] = com;
      // 流程编排中没有配置fieldAuths这个字段默认可见
      visbles[fieldName] = fieldsAuths[fieldName] !== AuthType.Denied;
    });

    // 设置表单初始值
    form.setFieldsValue(formValues);

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
              const { config, props = {} } = compMaps[fieldId];
              const { fieldName, colSpace, label, desc } = config;
              const isRequired = fieldsAuths[fieldName] === AuthType.Required;
              const compProps = { ...props };
              const Component = compSources[config.type as AllComponentType['type']];

              if (!fieldsVisible[fieldName] || !Component) return null;

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
                    name={fieldName}
                    label={<LabelContent label={label} desc={desc} />}
                    required={isRequired}
                    rules={rules}
                  >
                    {compRender(
                      config.type,
                      Component,
                      Object.assign({}, compProps, {
                        disabled: readonly || !fieldsAuths[fieldName] || fieldsAuths[fieldName] === AuthType.View,
                      }),
                      datasource && datasource[fieldName],
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
