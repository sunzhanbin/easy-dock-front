import React, { memo, useEffect, useState, useMemo } from 'react';
import { Form, Input, Row, Col, FormInstance } from 'antd';
import LabelContent from '../label-content';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FieldAuthsMap, AuthType, FormMeta, FormValue } from '@type/flow';
import useLoadComponents from '@/hooks/use-load-components';
import styles from './index.module.scss';

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormMeta;
  fieldsAuths: FieldAuthsMap;
  initialValue: { [key: string]: any };
}

type CompMaps = {
  [componentId: string]: FormMeta['components'][number];
};

const FormDetail = React.forwardRef(function FormDetail(
  props: FormProps,
  ref: React.ForwardedRef<FormInstance<FormValue>>,
) {
  const { data, fieldsAuths, initialValue } = props;
  const [form] = Form.useForm<FormValue>();
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});

  // 提取所有组件类型
  const componentTypes = useMemo(() => {
    console.info(data);
    return data.components.map((comp) => comp.type);
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

    data.components.forEach((com) => {
      const comId = com.id!;

      comMaps[comId] = com;
      // 流程编排中没有配置fieldAuths这个字段默认可见
      visbles[comId] = fieldsAuths[comId] !== AuthType.Denied;
    });

    // 设置表单初始值
    form.setFieldsValue(initialValue);

    setCompMaps(comMaps);
    // 设置字段可见性, 不能和下面代码交互执行顺序
    setFieldsVisible(visbles);
    // 设置完初始值后设置当前字段可见状态
    formValuesChange(initialValue);
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
        // 空行或者该行字段全不可见不渲染
        if (!formRow.length || !formRow.find((fieldId) => fieldsVisible[fieldId])) return null;

        return (
          <Row key={index} className={styles.row}>
            {formRow.map((fieldId) => {
              if (!fieldsVisible[fieldId] || !compSources) {
                return null;
              }

              const Component = compSources[compMaps[fieldId].type]!;

              return (
                <Col span={compMaps[fieldId].colSpace! * 6} key={fieldId} className={styles.col}>
                  <Form.Item
                    key={fieldId}
                    name={fieldId}
                    label={<LabelContent label={compMaps[fieldId].label} desc={compMaps[fieldId].desc} />}
                    required={fieldsAuths[fieldId] === AuthType.Required}
                  >
                    <Component
                      readOnly={!fieldsAuths[fieldId] || fieldsAuths[fieldId] === AuthType.View}
                      {...compMaps[fieldId]}
                    />
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
