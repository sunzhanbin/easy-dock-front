import { memo, useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import styles from '../comp-attr-editor/index.module.scss';
import { formatNumber } from '@utils';

interface LimitNumProps {
  id: string;
  componentId?: string;
}

const NumRangeComponent = (props: { id: string; form: any }) => {
  const { id, form } = props;
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
              console.log(form.getFieldsValue(), 'value');
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
          formatter={(value) => formatNumber(value, fieldValue)}
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
          formatter={(value) => formatNumber(value, fieldValue)}
          {...{ precision: fieldValue?.enable ? fieldValue.precision : 10 }}
        />
      </Form.Item>
    </div>
  );
};

const LimitNum = (props: any) => {
  return (
    <Form.Item noStyle name="numlimit">
      <Form.Item noStyle name={['numlimit', props.id]}>
        <NumRangeComponent {...props} />
      </Form.Item>
    </Form.Item>
  );
};

export default memo(LimitNum, (prev, next) => prev.componentId === next.componentId);
