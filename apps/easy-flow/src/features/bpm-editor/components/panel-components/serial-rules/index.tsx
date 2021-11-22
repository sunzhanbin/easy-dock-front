import React, { useEffect, memo, useMemo, useState } from 'react';
import { FormField, RuleOption, serialRulesItem } from '@type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import classNames from 'classnames';
import RuleComponent from './components/rule-component';
import { Icon } from '@common/components';
import { Button, Form, message } from 'antd';
import RuleModal from './components/modal-rule';
import { getSerialId, saveSerialRules } from '@apis/form';
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
  const serialMata = value?.serialMata;
  console.log(value, 'seeee');
  // 编号规则类型
  const [type, setType] = useState<string>('custom');
  // 选择已有规则弹框
  const [ruleModal, setRuleModal] = useState<boolean>(false);
  const [rules, setRules] = useState<RuleOption[]>(serialMata?.rules || initialRules);
  const [changeRules, setChangeRules] = useState<RuleOption[]>(serialMata?.changeRules || []);
  const [resetRules, setResetRules] = useState<RuleOption[]>([]);
  const [resetRuleName, setResetRuleName] = useState<string>('');
  const [ruleName, setRuleName] = useState<string>('');
  const [changeRuleName, setChangeRuleName] = useState<string>(serialMata?.changeRuleName || '');
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

  // 获取已有编号下的规则配置
  const getSerial = useMemoCallback(async () => {
    try {
      if (!value?.serialId) return;
      const ret = await getSerialId(value?.serialId);
      const { status, mata, name } = ret.data;
      setRuleStatus(status);
      setResetRules(mata);
      setResetRuleName(name);
      formChangeSerial.setFieldsValue({ name });
      setEditStatus(false);
      setChangeRules(mata);
    } catch (e) {
      console.log(e);
    }
  });
  // 自定义规则/引用规则
  const handleTypeChange = useMemoCallback((type) => {
    setType(type);
    onChange && onChange({ serialId, serialMata: { type } });
  });

  const handleRuleShow = useMemoCallback(() => {
    setRuleModal(true);
  });

  const handleCancelRuleModal = useMemoCallback(() => {
    setRuleModal(false);
  });
  const handleConfirmRule = useMemoCallback((selectedSerial) => {
    const { id, name, mata, status } = selectedSerial;
    setRuleModal(false);
    setSerialId(id);
    setChangeRules(mata);
    setRuleStatus(status);
    setResetRules(mata);
    setResetRuleName(name);
    formChangeSerial.setFieldsValue({ name });
    setEditStatus(false);
    onChange && onChange({ serialId: id, serialMata: { type, changeRuleName: name, changeRules: mata } });
  });
  const handleResetCustom = useMemoCallback(() => {
    setRuleName('');
    setRules(initialRules);
  });

  const handleOnChange = useMemoCallback((serialItem) => {
    const { type, rules, ruleName } = serialItem;
    if (type === 'custom') {
      setRuleName(ruleName);
      setRules(rules);
      onChange && onChange({ serialId, serialMata: { type, ruleName, rules: rules } });
    } else {
      setChangeRuleName(ruleName);
      setChangeRules(rules);
      onChange && onChange({ serialId, serialMata: { type, changeRuleName: ruleName, changeRules: rules } });
    }
  });

  const handleEditRule = useMemoCallback(() => {
    setEditStatus(true);
  });

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
      if (type === 'inject') return;
      const { data: serialMap } = ret;
      const { id, mata, status, name } = serialMap;
      setSerialId(id);
      setChangeRules(mata);
      setRuleStatus(status);
      setResetRules(mata);
      setResetRuleName(name);
      setChangeRuleName(name);
      handleResetCustom();
      onChange &&
        onChange({
          serialId,
          serialMata: { type, ruleName: '', rules: initialRules, changeRuleName: name, changeRules: mata },
        });
      handleTypeChange && handleTypeChange('inject');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setType(value?.serialId ? 'inject' : 'custom');
    value?.serialId && setSerialId(value?.serialId);
    getSerial();
  }, [value?.serialId, getSerial]);

  const handleCancelEdit = useMemoCallback(() => {
    setEditStatus(false);
    setChangeRules(resetRules);
    setChangeRuleName(resetRuleName);
  });

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <>
          <RuleComponent
            form={formSerial}
            rules={rules}
            ruleName={ruleName}
            type="custom"
            onChange={handleOnChange}
            fields={fields}
          />
          <Form.Item>
            <Button className={styles.add_custom} size="large" onClick={handleSaveRules}>
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
                <Form.Item>
                  <Button className={styles.add_custom} size="large" onClick={handleEditRule}>
                    <span>编辑规则</span>
                  </Button>
                </Form.Item>
              ) : (
                <div className={styles.flexbox}>
                  <Form.Item className={styles.flexItem}>
                    <Button className={styles.add_custom} size="large" onClick={handleCancelEdit}>
                      <span>取 消</span>
                    </Button>
                  </Form.Item>
                  <Form.Item className={styles.flexItem}>
                    <Button className={styles.add_custom} size="large" onClick={handleSaveRules}>
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

export default memo(SerialRules);
