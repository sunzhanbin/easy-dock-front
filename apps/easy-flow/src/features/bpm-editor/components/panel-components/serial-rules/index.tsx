import React, { useEffect, memo, useMemo, useState } from 'react';
import { RuleOption, serialRulesItem } from '@type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import classNames from 'classnames';
import RuleComponent from './components/rule-component';
import { Icon } from '@common/components';
import { Button, Form } from 'antd';
import RuleModal from './components/modal-rule';
import { saveSerialRules } from '@apis/form';
import { useSubAppDetail } from '@app/app';

interface RulesProps {
  id: string;
  value?: serialRulesItem;
  onChange?: (v: serialRulesItem) => void;
}

const SerialRules = (props: RulesProps) => {
  const { id, value, onChange } = props;
  console.log(value, 'value');
  const serialMata = value?.serialMata;
  const [type, setType] = useState<string>('custom');
  const [ruleModal, setRuleModal] = useState<boolean>(false);
  const [rules, setRules] = useState<RuleOption[]>(serialMata?.rules || []);
  const [changeRules, setChangeRules] = useState<RuleOption[]>(serialMata?.changeRules || []);
  const [ruleName, setRuleName] = useState<string>(serialMata?.ruleName || '');
  const [changeRuleName, setChangeRuleName] = useState<string>(serialMata?.changeRuleName || '');
  const [showChangeSerial, setShowChangeSerial] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<boolean>(false);
  const [ruleStatus, setRuleStatus] = useState<number>(1);
  const [serialId, setSerialId] = useState<number>(value?.serialId || 0);
  const [formSerial] = Form.useForm();
  const { data } = useSubAppDetail();

  useEffect(() => {
    setType(serialId ? 'inject' : 'custom');
  }, [serialId]);

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
    setRuleModal(false);
    setShowChangeSerial(true);
    setSerialId(selectedSerial.id);
    setChangeRuleName(selectedSerial.name);
    setChangeRules(selectedSerial.mata);
    setRuleStatus(selectedSerial.status);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          type,
          ruleName: selectedSerial?.name,
          changeRules: selectedSerial?.mata,
        },
      });
    // todo
    console.log(selectedSerial, 'selectedSerial');
  });

  const handleOnChange = useMemoCallback((serialItem) => {
    const { type, rules, ruleName } = serialItem;
    if (type === 'custom') {
      onChange && onChange({ serialId, serialMata: { type, ruleName, rules: rules } });
    } else {
      onChange &&
        onChange({
          serialId,
          serialMata: {
            type,
            ruleName,
            changeRules: rules,
          },
        });
    }
  });

  const handleEditRule = useMemoCallback(() => {
    setEditStatus(true);
  });

  const handleSaveRules = async () => {
    try {
      const values = await formSerial.validateFields();
      if (values.errorFields || !data) return;
      const { app } = data;
      const params = { appId: app?.id, name: values.name, rules };
      const ret = await saveSerialRules(params);
      console.log(ret, 'ret');
      if (!ret || !ret.data) return;
      const { data: serialMap } = ret;
      setEditStatus(false);
      setSerialId(serialMap.id);
      setChangeRules(serialMap.mata);
      handleTypeChange && handleTypeChange('inject');
      console.log(ret, 'ret');
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelEdit = useMemoCallback(() => {
    setEditStatus(false);
  });

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <>
          <RuleComponent
            rules={rules}
            form={formSerial}
            setRules={setRules}
            ruleName={ruleName}
            setRuleName={setRuleName}
            type="custom"
            handleTypeChange={handleTypeChange}
            onChange={handleOnChange}
            id={id}
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
              <Button className={styles.add_inject} size="large" onClick={handleRuleShow}>
                <Icon className={styles.iconfont} type="xinzengjiacu" />
                <span>更换规则</span>
              </Button>
              <RuleComponent
                id={id}
                rules={changeRules}
                setRules={setChangeRules}
                ruleName={ruleName}
                setRuleName={setRuleName}
                onChange={handleOnChange}
                ruleStatus={ruleStatus}
                editStatus={editStatus}
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
                <div>
                  <Form.Item>
                    <Button className={styles.add_custom} size="large" onClick={handleCancelEdit}>
                      <span>取 消</span>
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button className={styles.add_custom} size="large" onClick={handleSaveRules}>
                      <span>保 存</span>
                    </Button>
                  </Form.Item>
                </div>
              )}
            </div>
          )}
          <RuleModal showRuleModal={ruleModal} onCancel={handleCancelRuleModal} onSubmit={handleConfirmRule} />
        </>
      );
    }
    return null;
  });
  return (
    <div>
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
    </div>
  );
};

export default memo(SerialRules);
