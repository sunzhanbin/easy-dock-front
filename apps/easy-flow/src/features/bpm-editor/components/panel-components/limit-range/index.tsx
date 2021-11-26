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
        {(({getFieldValue}) => {
          const isChecked = getFieldValue('numlimit');
          const fieldValue = getFieldValue('decimal');
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
                      if (!getFieldValue(['numlimit', id, 'max']) && (value === undefined || value === null)) {
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
                  max={getFieldValue(['numlimit', id, 'max'])}
                  {...(fieldValue?.enable ? { precision: fieldValue.precision } : '')}
                />
              </Form.Item>
              <span className={styles.text}>~</span>
              <Form.Item
                className={styles.Item}
                name={['numlimit', id, 'max']}
                rules={[
                  {
                    validator(_: any, value: number) {
                      if (!getFieldValue(['numlimit', id, 'min']) && (value === undefined || value === null)) {
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
                  min={getFieldValue(['numlimit', id, 'min'])}
                  {...(fieldValue?.enable ? { precision: fieldValue.precision } : '')}
                />
              </Form.Item>
            </div>
          );
        })}
      </Form.Item>
  );
};

export default memo(LimitNum, (prev, next) => prev.componentId === next.componentId);
