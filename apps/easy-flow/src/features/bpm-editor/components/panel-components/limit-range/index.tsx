import { memo } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';

const LimitNum = ({ id }: { id: string }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const isChecked = form.getFieldValue('limit');
        const decimalCount = form.getFieldValue('decimalCount');
        if (!isChecked) {
          return null;
        }
        return (
          <div className={styles.limitRange}>
            <Form.Item className={styles.Item} name={[id, 'min']}>
              <InputNumber size="large" placeholder="最小值" {...(decimalCount ? { precision: decimalCount } : '')} />
            </Form.Item>
            <span className={styles.text}>~</span>
            <Form.Item className={styles.Item} name={[id, 'max']}>
              <InputNumber size="large" placeholder="最大值" {...(decimalCount ? { precision: decimalCount } : '')} />
            </Form.Item>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(LimitNum);
