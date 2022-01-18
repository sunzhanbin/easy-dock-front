import { memo, useImperativeHandle, useState, forwardRef } from "react";
import styles from "../index.module.scss";
import RuleComponent from "./rule-component";
import RuleModal from "./modal-rule";
import { Form, Button } from "antd";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { saveSerialRules } from "@apis/form";
import { SERIAL_TYPE } from "@utils/const";

const InjectRule = (props: any, ref: React.Ref<unknown> | undefined) => {
  const {
    serialId,
    id,
    onChange,
    ruleStatus,
    fields,
    isError,
    setErrors,
    editStatus,
    onSave,
    onCancelEdit,
    onConfirmRule,
    onEdit,
    appId,
    rules,
    ruleName,
  } = props;

  const [formChangeSerial] = Form.useForm();
  // 选择已有规则弹框
  const [ruleModal, setRuleModal] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    reset: (name: string) => {
      formChangeSerial.setFieldsValue({ name: name || "" });
    },
  }));

  const handleRuleShow = () => {
    setRuleModal(true);
  };

  const handleCancelRuleModal = () => {
    setRuleModal(false);
  };

  const handleCancelEdit = () => {
    onCancelEdit && onCancelEdit();
  };

  const handleSaveRules = useMemoCallback(async () => {
    try {
      const values = await formChangeSerial.validateFields();
      if (values.errorFields || !appId) return;
      const hasChars = rules.some(
        (item: { type: string; chars?: string }) => item.type === "fixedChars" && !item.chars,
      );
      if (hasChars) {
        return setErrors(hasChars);
      }
      const params = { appId: appId, name: values.name, rules: rules, id: serialId };
      const ret = await saveSerialRules(params);
      onSave && onSave(SERIAL_TYPE.INJECT_TYPE, ret.data);
    } catch (e) {
      console.log(e);
    }
  });

  const handleConfirmRule = useMemoCallback((selectedSerial) => {
    const { name } = selectedSerial;
    setRuleModal(false);
    formChangeSerial.setFieldsValue({ name });
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
            isError={isError}
            ruleStatus={ruleStatus}
            editStatus={!editStatus}
            serialId={serialId}
            type={SERIAL_TYPE.INJECT_TYPE}
          />
          {!editStatus ? (
            <Form.Item noStyle>
              <Button className={styles.edit_btn} size="large" onClick={onEdit}>
                <span>编辑规则</span>
              </Button>
            </Form.Item>
          ) : (
            <div className={styles.edit_save_btn}>
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
          serialId={serialId}
          onCancel={handleCancelRuleModal}
          onSubmit={handleConfirmRule}
        />
      )}
    </>
  );
};

export default memo(forwardRef(InjectRule));
