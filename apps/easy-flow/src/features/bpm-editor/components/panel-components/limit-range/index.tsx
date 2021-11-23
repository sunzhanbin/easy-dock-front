import { memo } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';

const LimitNum = ({ id }: { id: string }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const isChecked = form.getFieldValue('numlimit');
        const fieldValue = form.getFieldValue('decimal');
        if (!isChecked || !isChecked.enable) {
          return null;
        }
        return (
          <div className={styles.limitRange}>
            <Form.Item
              className={styles.Item}
              name={['numlimit', id, 'min']}
              rules={[{ required: true, message: '请输入!' }]}
            >
              <InputNumber
                size="large"
                placeholder="最小值"
                max={form.getFieldValue('numlimit')?.[id]?.max}
                {...(fieldValue?.enable ? { precision: fieldValue.precision } : '')}
              />
            </Form.Item>
            <span className={styles.text}>~</span>
            <Form.Item
              className={styles.Item}
              name={['numlimit', id, 'max']}
              rules={[{ required: true, message: '请输入!' }]}
            >
              <InputNumber
                size="large"
                placeholder="最大值"
                min={form.getFieldValue('numlimit')?.[id]?.min}
                {...(fieldValue?.enable ? { precision: fieldValue.precision } : '')}
              />
            </Form.Item>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(LimitNum);
