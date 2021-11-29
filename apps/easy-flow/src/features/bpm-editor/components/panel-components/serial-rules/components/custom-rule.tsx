import React, { memo, forwardRef, useImperativeHandle } from 'react';
import RuleComponent from './rule-component';
import styles from '../index.module.scss';
import { Form, Button } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { saveSerialRules } from '@apis/form';
import { SERIAL_TYPE } from '@utils/const';

const CustomRule = (props: any, ref: React.Ref<unknown> | undefined) => {
  const { rules, ruleName, id, onChange, fields, onSave, appId } = props;

  const [formSerial] = Form.useForm();

  useImperativeHandle(ref, () => ({
    reset: () => {
      formSerial.setFieldsValue({ name: '' });
    },
  }));

  const handleSaveRules = useMemoCallback(async () => {
    try {
      const values = await formSerial.validateFields();
      if (values.errorFields || !appId) return;
      const params = { appId: appId, name: values.name, rules };
      // console.log(ret, 'ret');
      const ret = await saveSerialRules(params);
      onSave && onSave(SERIAL_TYPE.CUSTOM_TYPE, ret.data);
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <>
      <RuleComponent
        form={formSerial}
        rules={rules}
        ruleName={ruleName}
        type={SERIAL_TYPE.CUSTOM_TYPE}
        id={id}
        onChange={onChange}
        fields={fields}
      />
      {/*onClick={handleSaveRules}*/}
      <Form.Item noStyle>
        <Button className={styles.save_custom} size="large" onClick={handleSaveRules}>
          <span>保存并应用</span>
        </Button>
      </Form.Item>
    </>
  );
};

export default memo(forwardRef(CustomRule));
