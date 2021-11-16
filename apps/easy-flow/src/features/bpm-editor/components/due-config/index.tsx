import { memo } from 'react';
import { Form, Checkbox, InputNumber, Select } from 'antd';
import { Icon } from '@common/components';
import { AuthType, IDueConfig } from '@/type/flow';
import MemberSelector from '../member-selector';
import TimeoutAction from '../timeout-action';
import styles from './index.module.scss';

export interface DueConfigProps {
  name: string;
  showAction?: boolean;
  value?: IDueConfig;
  onChange?: (value: this['value']) => void;
}
const { Option } = Select;
const units = [
  { value: 'day', label: '天' },
  { value: 'hour', label: '小时' },
  { value: 'minute', label: '分钟' },
];

const DueConfig = ({ name, showAction = false }: DueConfigProps) => {
  return (
    <>
      <Form.Item name={[name, 'enable']} valuePropName="checked" style={{ marginBottom: '12px' }}>
        <Checkbox>节点超时通知</Checkbox>
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const enable = getFieldValue([name, 'enable']);
          if (enable) {
            const fieldAuthList = getFieldValue('fieldsAuths');
            const hasRequired = Object.values(fieldAuthList).some((v) => v === AuthType.Required); // 该节点是否有必填字段,如果有必填字段则不能选择超时自动通过
            return (
              <>
                <div className={styles.timeout}>
                  <div className={styles.text}>流程到达该节点</div>
                  <Form.Item noStyle shouldUpdate name={[name, 'timeout', 'num']}>
                    <InputNumber className={styles.num} placeholder="请输入" size="large" />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate name={[name, 'timeout', 'unit']}>
                    <Select
                      placeholder="请选择"
                      size="large"
                      virtual={false}
                      className={styles.unit}
                      suffixIcon={<Icon type="xiala" />}
                      getPopupContainer={(node) => node}
                    >
                      {units.map((v) => (
                        <Option key={v.value} value={v.value}>
                          {v.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.text}>后,</div>
                </div>
                <div className={styles.tip}>自动通知以下人员：</div>
                <Form.Item name={[name, 'notice', 'starter']} valuePropName="checked" className={styles.notice}>
                  <Checkbox>流程发起人</Checkbox>
                </Form.Item>
                <Form.Item name={[name, 'notice', 'assign']} valuePropName="checked" className={styles.notice}>
                  <Checkbox>节点审批人</Checkbox>
                </Form.Item>
                <Form.Item name={[name, 'notice', 'admin']} valuePropName="checked" className={styles.notice}>
                  <Checkbox>系统管理员</Checkbox>
                </Form.Item>
                <Form.Item name={[name, 'notice', 'other']} valuePropName="checked" className={styles.notice}>
                  <Checkbox>其他人员</Checkbox>
                </Form.Item>
                {
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const other = getFieldValue([name, 'notice', 'other']);
                      if (other) {
                        return (
                          <Form.Item name={[name, 'notice', 'users']} label="选择其他人员">
                            <MemberSelector />
                          </Form.Item>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                }
                <div className={styles.cycle}>
                  <Form.Item noStyle shouldUpdate name={[name, 'cycle', 'enable']}>
                    <Checkbox className={styles.checkbox}></Checkbox>
                  </Form.Item>
                  <div className={styles.text}>每超过</div>
                  <Form.Item noStyle shouldUpdate name={[name, 'cycle', 'num']}>
                    <InputNumber className={styles.num} placeholder="请输入" size="large" />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate name={[name, 'cycle', 'unit']}>
                    <Select
                      placeholder="请选择"
                      size="large"
                      virtual={false}
                      className={styles.unit}
                      suffixIcon={<Icon type="xiala" />}
                      getPopupContainer={(node) => node}
                    >
                      {units.map((v) => (
                        <Option key={v.value} value={v.value}>
                          {v.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.text}>再次通知</div>
                </div>
                {showAction && (
                  <Form.Item noStyle shouldUpdate name={[name, 'action']}>
                    <TimeoutAction hasRequired={hasRequired} />
                  </Form.Item>
                )}
              </>
            );
          }
          return null;
        }}
      </Form.Item>
    </>
  );
};

export default memo(DueConfig);
