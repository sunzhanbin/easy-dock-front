import React, { useEffect, memo, useMemo, useState, useCallback } from 'react';
import { FormField, RuleOption, SerialNumField, serialRulesItem } from '@type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import classNames from 'classnames';
import RuleComponent from './components/rule-component';
import { Icon } from '@common/components';
import { Button, Form, message } from 'antd';
import RuleModal from './components/modal-rule';
import { saveSerialRules } from '@apis/form';
import { useSubAppDetail } from '@app/app';
import { useAppSelector } from '@app/hooks';
import { initialRules } from '@utils/const';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

interface RulesProps {
  id: string;
  value?: serialRulesItem;
  onChange?: (v: serialRulesItem) => void;
}

const SerialRules = (props: RulesProps) => {
  const { id, value, onChange } = props;
  // 编号规则类型
  const [type, setType] = useState<string>('');
  // 选择已有规则弹框
  const [ruleModal, setRuleModal] = useState<boolean>(false);
  const [rules, setRules] = useState<RuleOption[]>([]);
  const [changeRules, setChangeRules] = useState<RuleOption[]>([]);
  const [resetRules, setResetRules] = useState<RuleOption[]>(value?.serialMata?.changeRules || []);
  const [resetRuleName, setResetRuleName] = useState<string>(value?.serialMata?.changeRuleName || '');
  const [ruleName, setRuleName] = useState<string>('');
  const [changeRuleName, setChangeRuleName] = useState<string>('');
  // 是否可编辑   默认不可编辑
  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [ruleStatus, setRuleStatus] = useState<number>(1);
  const [serialId, setSerialId] = useState('');
  const [formSerial] = Form.useForm();
  const [formChangeSerial] = Form.useForm();
  const { data } = useSubAppDetail();
  const byId = useAppSelector(componentPropsSelector);
  const fields = useMemo<{ id: string; name: string }[]>(() => {
    const componentList = Object.values(byId).map((item: FormField) => item) || [];
    const compType = ['Date', 'Input', 'Radio', 'InputNumber'];
    return componentList
      .filter((com) => compType.includes(com.type) && com.id !== id)
      .map((com) => ({
        id: com.fieldName,
        name: com.label,
      }));
  }, [byId, id]);
  const fieldSerial = useMemo(() => {
    return (byId[id] as SerialNumField)?.serialRule;
  }, [id, byId]);

  useEffect(() => {
    if (!fieldSerial) return;
    const { serialId, serialMata } = fieldSerial;
    setRules(serialMata?.rules || initialRules);
    setChangeRules(serialMata?.changeRules || []);
    setRuleName(serialMata?.ruleName || '');
    setChangeRuleName(serialMata?.changeRuleName || '');
    setSerialId(serialId || '');
    setType(serialMata?.type || (serialId ? 'inject' : 'custom'));
  }, [fieldSerial]);
  // 自定义规则/引用规则
  const handleTypeChange = (type: string) => {
    setType(type);
  };

  const handleRuleShow = () => {
    setRuleModal(true);
  };

  const handleCancelRuleModal = useMemoCallback(() => {
    setRuleModal(false);
  });
  const handleConfirmRule = useMemoCallback((selectedSerial) => {
    const { name, mata, status } = selectedSerial;
    setRuleModal(false);
    setRuleStatus(status);
    setResetRules(mata);
    setResetRuleName(name);
    formChangeSerial.setFieldsValue({ name });
    setEditStatus(false);
    onChange &&
      onChange({
        serialId: selectedSerial.id,
        serialMata: { id, type, ruleName, rules, changeRuleName: name, changeRules: mata },
      });
  });

  const handleOnChange = (serialItem: { type: string; rules: any; ruleName: string }) => {
    const { type, rules: formRule, ruleName: formName } = serialItem;
    if (type === 'custom') {
      onChange &&
        onChange({
          serialId,
          serialMata: {
            id,
            type,
            ruleName: formName,
            rules: formRule,
            changeRuleName,
            changeRules,
          },
        });
    } else {
      onChange &&
        onChange({
          serialId,
          serialMata: { id, type, ruleName, rules, changeRuleName: formName, changeRules: formRule },
        });
    }
  };

  const handleEditRule = () => {
    setEditStatus(true);
  };

  const handleSaveRules = async () => {
    try {
      const values = type === 'inject' ? await formChangeSerial.validateFields() : await formSerial.validateFields();
      if (values.errorFields || !data) return;
      const { app } = data;
      let params;
      if (type === 'inject') {
        params = { appId: app?.id, name: values.name, rules: changeRules, id: serialId };
      } else {
        params = { appId: app?.id, name: values.name, rules };
      }
      const ret = await saveSerialRules(params);
      if (!ret || !ret.data) return;
      message.success('保存成功');
      setEditStatus(false);
      const { data: serialMap } = ret;
      const { mata, status, name } = serialMap;
      if (type === 'inject') return;
      formSerial.setFieldsValue({ name: '' });
      setResetRules(mata);
      setResetRuleName(name);
      setRuleStatus(status);
      formChangeSerial && formChangeSerial.setFieldsValue({ name });
      onChange &&
        onChange({
          serialId: serialMap.id,
          serialMata: {
            id,
            type: 'inject',
            ruleName: '',
            rules: initialRules,
            changeRuleName: name,
            changeRules: mata,
          },
        });
      handleTypeChange('inject');
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setEditStatus(false);
    formChangeSerial.setFieldsValue({ name: resetRuleName });
    onChange &&
      onChange({
        serialId,
        serialMata: {
          id,
          ruleName,
          rules,
          changeRules: resetRules,
          changeRuleName: resetRuleName,
        },
      });
  }, [resetRules, resetRuleName]);

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <>
          <RuleComponent
            form={formSerial}
            rules={rules}
            ruleName={ruleName}
            type="custom"
            id={id}
            onChange={handleOnChange}
            fields={fields}
          />
          <Form.Item noStyle>
            <Button className={styles.save_custom} size="large" onClick={handleSaveRules}>
              <span>保存并应用</span>
            </Button>
          </Form.Item>
        </>
      );
    } else if (type === 'inject') {
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
                rules={changeRules}
                ruleName={changeRuleName}
                onChange={handleOnChange}
                ruleStatus={ruleStatus}
                editStatus={!editStatus}
                serialId={serialId}
                type="inject"
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
    }
    return null;
  });
  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <div
            className={classNames(styles.custom, type === 'custom' ? styles.active : '')}
            onClick={() => {
              handleTypeChange('custom');
            }}
          >
            自定义规则
          </div>
          <div
            className={classNames(styles.subapp, type === 'inject' ? styles.active : '')}
            onClick={() => {
              handleTypeChange('inject');
            }}
          >
            使用已有规则
          </div>
        </div>
      </div>
      <div className={styles.content}>{renderContent()}</div>
    </>
  );
};

export default memo(SerialRules, (prev, next) => prev.id === next.id);
