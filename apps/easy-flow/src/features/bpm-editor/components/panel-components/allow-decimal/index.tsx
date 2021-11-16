import { memo } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';

const AllowDecimal = ({ id }: { id: string }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        const isChecked = form.getFieldValue('decimal');
        if (!isChecked) {
          return null;
        }
        return (
          <div className={styles.allowDecimal}>
            <span className={styles.text}>限制</span>
            <Form.Item className={styles.formItem} name={id}>
              <InputNumber size="large" min={1} max={10} placeholder="请输入" />
            </Form.Item>
            <span className={styles.text}>位</span>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(AllowDecimal);
