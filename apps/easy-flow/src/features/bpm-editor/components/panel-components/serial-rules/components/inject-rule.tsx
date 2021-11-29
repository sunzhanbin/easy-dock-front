import { memo, useImperativeHandle, useState, forwardRef } from 'react';
import styles from '../index.module.scss';
import RuleComponent from './rule-component';
import RuleModal from './modal-rule';
import { Form, Button } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { saveSerialRules } from '@apis/form';
import { SERIAL_TYPE } from '@utils/const';

const InjectRule = (props: any, ref: React.Ref<unknown> | undefined) => {
  const { serialId, id, onChange, fields, onSave, onCancelEdit, onConfirmRule, appId, rules, ruleName } = props;

  const [formChangeSerial] = Form.useForm();
  // 选择已有规则弹框
  const [ruleModal, setRuleModal] = useState<boolean>(false);
  // 是否可编辑   默认不可编辑
  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [ruleStatus, setRuleStatus] = useState<number>(1);
  useImperativeHandle(ref, () => ({
    reset: (name: string) => {
      formChangeSerial.setFieldsValue({ name: name || '' });
    },
    setEditStatus: (status: boolean) => {
      setEditStatus(status);
    },
    setRuleStatus: (status: number) => {
      setRuleStatus(status);
    },
  }));

  const handleRuleShow = () => {
    setRuleModal(true);
  };

  const handleCancelRuleModal = () => {
    setRuleModal(false);
  };

  const handleEditRule = () => {
    setEditStatus(true);
  };

  const handleCancelEdit = () => {
    setEditStatus(false);
    onCancelEdit && onCancelEdit();
  };

  const handleSaveRules = useMemoCallback(async () => {
    try {
      const values = await formChangeSerial.validateFields();
      if (values.errorFields || !appId) return;
      const params = { appId: appId, name: values.name, rules: rules, id: serialId };
      const ret = await saveSerialRules(params);
      onSave && onSave(SERIAL_TYPE.INJECT_TYPE, ret.data);
    } catch (e) {
      console.log(e);
    }
  });

  const handleConfirmRule = useMemoCallback((selectedSerial) => {
    const { name, status } = selectedSerial;
    setRuleModal(false);
    setRuleStatus(status);
    formChangeSerial.setFieldsValue({ name });
    setEditStatus(false);
    onConfirmRule && onConfirmRule(selectedSerial);
  });

  return (
    <>
      {!serialId ? (
        <Button className={styles.add_inject} size="large" onClick={handleRuleShow}>
          <Icon className={styles.iconfont} type="xinzengjiacu" />
          <span>选择规则</span>
        </Button>
      ) : (
        <div className={styles.content}>
          <Button className={styles.add_change} size="large" onClick={handleRuleShow}>
            <Icon className={styles.iconfont} type="xinzengjiacu" />
            <span>更换规则</span>
          </Button>
          <RuleComponent
            fields={fields}
            id={id}
            form={formChangeSerial}
            rules={rules}
            ruleName={ruleName}
            onChange={onChange}
            ruleStatus={ruleStatus}
            editStatus={!editStatus}
            serialId={serialId}
            type={SERIAL_TYPE.INJECT_TYPE}
          />
          {!editStatus ? (
            <Form.Item noStyle>
              <Button className={styles.add_custom} size="large" onClick={handleEditRule}>
                <span>编辑规则</span>
              </Button>
            </Form.Item>
          ) : (
            <div className={styles.flexbox}>
              <Form.Item noStyle>
                <Button className={styles.change_btn} size="large" onClick={handleCancelEdit}>
                  <span>取 消</span>
                </Button>
              </Form.Item>
              <Form.Item noStyle>
                <Button className={styles.change_btn} size="large" onClick={handleSaveRules}>
                  <span>保 存</span>
                </Button>
              </Form.Item>
            </div>
          )}
        </div>
      )}
      {ruleModal && (
        <RuleModal
          showRuleModal={ruleModal}
          fields={fields}
          onCancel={handleCancelRuleModal}
          onSubmit={handleConfirmRule}
        />
      )}
    </>
  );
};

export default memo(forwardRef(InjectRule));
