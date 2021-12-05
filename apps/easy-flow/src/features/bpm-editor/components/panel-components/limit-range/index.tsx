import { memo } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';

interface LimitNumProps {
  id: string;
  componentId?: string;
}

const LimitNum = ({ id }: LimitNumProps) => {
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
              rules={[
                {
                  validator(_: any, value: number) {
                    if (!form.getFieldValue(['numlimit', id, 'max']) && (value === undefined || value === null)) {
                      return Promise.reject(new Error('请输入取值范围'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="最小值"
                max={form.getFieldValue(['numlimit', id, 'max'])}
                onChange={() => form.validateFields([['numlimit', id, 'max']])}
                formatter={(value) => {
                  if (value.indexOf('.') === -1) return value;
                  const strLength = value.toString().split('.')[1].length;
                  if (fieldValue?.enable && strLength > fieldValue.precision) {
                    return value.substring(0, value.indexOf('.') + fieldValue.precision + 1);
                  } else {
                    if (strLength > 10) {
                      return value.substring(0, value.indexOf('.') + 11);
                    } else {
                      return value;
                    }
                  }
                }}
                {...{ precision: fieldValue?.enable ? fieldValue.precision : 10 }}
              />
            </Form.Item>
            <span className={styles.text}>~</span>
            <Form.Item
              className={styles.Item}
              name={['numlimit', id, 'max']}
              rules={[
                {
                  validator(_: any, value: number) {
                    if (!form.getFieldValue(['numlimit', id, 'min']) && (value === undefined || value === null)) {
                      return Promise.reject(new Error('请输入取值范围'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="最大值"
                min={form.getFieldValue(['numlimit', id, 'min'])}
                onChange={() => form.validateFields([['numlimit', id, 'min']])}
                formatter={(value) => {
                  if (value.indexOf('.') === -1) return value;
                  const strLength = value.toString().split('.')[1].length;
                  if (fieldValue?.enable && strLength > fieldValue.precision) {
                    return value.substring(0, value.indexOf('.') + fieldValue.precision + 1);
                  } else {
                    if (strLength > 10) {
                      return value.substring(0, value.indexOf('.') + 11);
                    } else {
                      return value;
                    }
                  }
                }}
                {...{ precision: fieldValue?.enable ? fieldValue.precision : 10 }}
              />
            </Form.Item>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default memo(LimitNum, (prev, next) => prev.componentId === next.componentId);
