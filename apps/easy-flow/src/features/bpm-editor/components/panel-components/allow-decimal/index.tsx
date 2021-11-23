import React, { memo } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';
import { FormInstance } from 'antd/es';

const AllowDecimal = (props: { id: string; onChange?: (v: any) => void }) => {
  const { id, onChange } = props;
  return (
    <Form.Item name="decimal" shouldUpdate noStyle>
      <Form.Item noStyle shouldUpdate>
        {(form: FormInstance) => {
          const isChecked = form.getFieldValue('decimal');
          if (!isChecked || !isChecked.enable) {
            return null;
          }
          if (!isChecked?.[id]) {
            form.setFieldsValue({
              decimal: {
                ...isChecked,
                precision: 1,
              },
            });
            onChange &&
              onChange({
                ...isChecked,
                precision: 1,
              });
          }
          return (
            <div className={styles.allowDecimal}>
              <span className={styles.text}>限制</span>
              <Form.Item
                className={styles.formItem}
                name={['decimal', id]}
                rules={[{ required: isChecked.enable, message: '请输入!' }]}
              >
                <InputNumber size="large" min={1} max={10} placeholder="请输入" />
              </Form.Item>
              <span className={styles.text}>位</span>
            </div>
          );
        }}
      </Form.Item>
    </Form.Item>
  );
};

export default memo(AllowDecimal);
