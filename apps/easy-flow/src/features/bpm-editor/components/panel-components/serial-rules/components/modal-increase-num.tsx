import React, { memo, useState } from 'react';
import { Form, Modal, InputNumber, Select } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from '../index.module.scss';
import { RuleOption } from '@type';
import { getPopupContainer } from '@utils';
import { ResetDurationOptions } from '@utils/const';

interface IncNumProps {
  showIncModal: boolean;
  onCancel: () => void;
  onSubmit: (fieldsValue: any) => void;
  data: RuleOption;
}

const { Option } = Select;
const MODAL_TYPE = { type: 'incNumber' };

const IncNumModal = (props: IncNumProps) => {
  const { showIncModal, onCancel, onSubmit, data } = props;
  const [form] = Form.useForm();
  const [digitsNum, setDigitsNum] = useState<number>(data.digitsNum || 5); // 计数位数
  const [resetDuration, setResetDuration] = useState<string>(data.resetDuration || 'none'); // 重置周期
  const [startValue, setStartValue] = useState<number>(data.startValue || 1); // 初始值

  const handleSubmit = useMemoCallback(() => {
    const params = Object.assign({}, MODAL_TYPE, form.getFieldsValue());
    onSubmit && onSubmit(params);
  });

  return (
    <Modal
      width={350}
      className={styles.modalIncrease}
      visible={showIncModal}
      title={'计数设置'}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="确 认"
      cancelText="取 消"
      cancelButtonProps={{ type: 'text', size: 'large' }}
      okButtonProps={{ size: 'large' }}
      destroyOnClose={true}
      maskClosable={false}
      getContainer={false}
    >
      <Form form={form} layout="vertical" autoComplete="off" initialValues={props.data}>
        <Form.Item label="计数位数" name="digitsNum">
          <InputNumber min={1} max={10} value={digitsNum} onChange={setDigitsNum} className={styles.formItem} />
        </Form.Item>
        <Form.Item label="重置周期">
          <Form.Item name="resetDuration" style={{ marginBottom: '5px' }}>
            <Select
              placeholder="请选择"
              size="large"
              className={styles.formItem}
              value={resetDuration}
              onChange={(value) => setResetDuration(value)}
              getPopupContainer={getPopupContainer}
            >
              {ResetDurationOptions.map(({ key, value }) => (
                <Option key={key} value={key} label={value}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <p className={styles.resetTips}>仅当计数达到最大值时，从0开始重新计数。</p>
        </Form.Item>
        <Form.Item label="初始值" name="startValue">
          <InputNumber
            min={1}
            max={Math.pow(10, digitsNum) - 1}
            value={startValue}
            onChange={setStartValue}
            className={styles.formItem}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(IncNumModal);
