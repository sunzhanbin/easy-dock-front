import React, { memo, useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';

const DecimalComponent = (props: { id: string; formInstance: any }) => {
  const { id, formInstance } = props;
  const isChecked = formInstance.getFieldValue('decimal');

  useEffect(() => {
    if (!isChecked?.[id]) {
      formInstance.setFieldsValue({
        decimal: {
          ...isChecked,
          precision: 1,
        },
      });
    }
  }, [formInstance, isChecked, id]);

  if (!isChecked || !isChecked.enable) {
    return null;
  }
  return (
    <div className={styles.allowDecimal}>
      <span className={styles.text}>限制</span>
      <Form.Item
        className={styles.formItem}
        name={['decimal', id]}
        rules={[{ required: isChecked.enable, message: '请输入小数位数' }]}
      >
        <InputNumber size="large" min={1} max={10} placeholder="请输入" />
      </Form.Item>
      <span className={styles.text}>位</span>
    </div>
  );
};

const AllowDecimal = (props: { id: string; formInstance: any; onChange?: (v: any) => void }) => {
  return (
    <Form.Item name="decimal" noStyle>
      <DecimalComponent {...props} />
    </Form.Item>
  );
};

export default memo(AllowDecimal);
