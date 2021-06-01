import { memo, useEffect, useState } from 'react';
import { Form, Input, Row, Col } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { FieldAuthsMap, AuthType } from '../bpm-editor/flow-design/types';
import { FormInfo } from './type';

type FormValueType = { [key: string]: any };

type FieldsVisible = { [fieldId: string]: boolean };

interface FormProps {
  data: FormInfo;
  fieldsAuths: FieldAuthsMap;
  initialValue: { [key: string]: any };
}

type CompMaps = {
  [componentId: string]: FormInfo['components'][number];
};

function FormDetail(props: FormProps) {
  const { data, fieldsAuths, initialValue } = props;
  const [form] = Form.useForm<FormValueType>();
  const [fieldsVisible, setFieldsVisible] = useState<FieldsVisible>({});
  const [compMaps, setCompMaps] = useState<CompMaps>({});
  const formValuesChange = useMemoCallback((changedValues: FormValueType) => {
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
    const comMaps: { [key: string]: FormInfo['components'][number] } = {};

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
    <div>
      <Form form={form} layout="vertical" autoComplete="off" onValuesChange={formValuesChange}>
        {data.layout.map((formRow, index) => {
          // 空行或者该行字段全不可见不渲染
          if (!formRow.length || !formRow.find((fieldId) => fieldsVisible[fieldId])) return null;

          return (
            <Row key={index}>
              {formRow.map((fieldId) => {
                if (!fieldsVisible[fieldId]) {
                  return null;
                }

                return (
                  <Col span={compMaps[fieldId].colSpace! * 6} key={fieldId}>
                    <Form.Item
                      key={fieldId}
                      name={fieldId}
                      label={fieldId}
                      required={fieldsAuths[fieldId] === AuthType.Required}
                    >
                      <Input
                        readOnly={!fieldsAuths[fieldId] || fieldsAuths[fieldId] === AuthType.View}
                      />
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </Form>
    </div>
  );
}

export default memo(FormDetail);
