import React, { useEffect, memo, useMemo, useState, useRef } from 'react';
import { FormField, RuleOption, SerialNumField, serialRulesItem } from '@type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import styles from './index.module.scss';
import classNames from 'classnames';
import CustomRule from './components/custom-rule';
import InjectRule from './components/inject-rule';
import { message } from 'antd';
import { useSubAppDetail } from '@app/app';
import { useAppSelector } from '@app/hooks';
import { getSerialInfo } from '@apis/form';
import { initialRules } from '@utils/const';
import { componentPropsSelector, errorSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { SERIAL_TYPE } from '@utils/const';

interface RulesProps {
  id: string;
  value?: serialRulesItem;
  onChange?: (v: serialRulesItem) => void;
}

const SerialRules = (props: RulesProps) => {
  const { id, value, onChange } = props;
  const [serialId, setSerialId] = useState('');
  const customRef = useRef<any>(null);
  const injectRef = useRef<any>(null);
  const { data } = useSubAppDetail();
  const byId = useAppSelector(componentPropsSelector);
  const errors = useAppSelector(errorSelector);
  const [type, setType] = useState<string>(''); // 编号规则类型
  const [rules, setRules] = useState<RuleOption[]>([]); // 自定义规则
  const [changeRules, setChangeRules] = useState<RuleOption[]>([]); // 已有规则
  // 得从接口里面拿
  const [resetRules, setResetRules] = useState<RuleOption[]>(value?.serialMata?.changeRules || []); // 取消时重置规则
  const [resetRuleName, setResetRuleName] = useState<string>(value?.serialMata?.changeRuleName || '');
  const [ruleName, setRuleName] = useState<string>('');
  const [changeRuleName, setChangeRuleName] = useState<string>('');
  const [ruleStatus, setRuleStatus] = useState<number | undefined>(undefined);
  // 是否可编辑   默认不可编辑
  const [editStatus, setEditStatus] = useState<boolean | undefined>(undefined);
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
  const [isError, setErrors] = useState<boolean>(false);
  const [isErrorCustom, setErrorsCustom] = useState<boolean>(false);

  useEffect(() => {
    if (!fieldSerial) return;
    const { serialId, serialMata } = fieldSerial;
    setRules(serialMata?.rules || initialRules);
    setChangeRules(serialMata?.changeRules || []);
    setRuleName(serialMata?.ruleName || '');
    setChangeRuleName(serialMata?.changeRuleName || '');
    setSerialId(serialId || '');
    setEditStatus(serialMata?.editStatus);
    setType(serialMata?.type || (serialId ? SERIAL_TYPE.INJECT_TYPE : SERIAL_TYPE.CUSTOM_TYPE));
  }, [fieldSerial]);

  useEffect(() => {
    const errorList = errors.find((item) => item.id === id);
    if (errorList && errorList.content.includes('请输入已有规则固定字符')) {
      setEditStatus(true);
      setErrors(true);
    }
    if (errorList && errorList.content.includes('请输入自定义规则固定字符')) {
      setErrorsCustom(true);
    }
  }, [errors, id]);

  useEffect(() => {
    (async () => {
      try {
        if (!serialId) return;
        const ret = await getSerialInfo(serialId);
        const { data } = ret;
        setRuleStatus(data.status === 0 ? 0 : 1);
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line
  }, [serialId]);

  // 自定义规则/引用规则
  const handleTypeChange = (type: string) => {
    setType(type);
  };

  const handleConfirmRule = useMemoCallback((selectedSerial) => {
    const { name, mata, status } = selectedSerial;
    setResetRules(mata);
    setResetRuleName(name);
    setRuleStatus(status);
    setEditStatus(false);
    onChange &&
      onChange({
        serialId: selectedSerial.id,
        serialMata: {
          id,
          type,
          ruleName,
          rules,
          changeRuleName: name,
          changeRules: mata,
          editStatus: false,
        },
      });
  });

  const handleEditRule = () => {
    setEditStatus(true);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          id,
          type,
          ruleName,
          rules,
          changeRuleName,
          changeRules,
          editStatus: true,
        },
      });
  };

  const handleOnChange = (serialItem: { type: string; rules: any; ruleName: string }) => {
    const { type, rules: formRule, ruleName: formName } = serialItem;
    if (type === SERIAL_TYPE.CUSTOM_TYPE) {
      const hasChars = formRule.some(
        (item: { type: string; chars?: string }) => item.type === 'fixedChars' && !item.chars,
      );
      setErrorsCustom(hasChars);
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
            editStatus,
          },
        });
    } else {
      const hasChars = formRule.some(
        (item: { type: string; chars?: string }) => item.type === 'fixedChars' && !item.chars,
      );
      setErrors(hasChars);
      onChange &&
        onChange({
          serialId,
          serialMata: {
            id,
            type,
            ruleName,
            rules,
            changeRuleName: formName,
            changeRules: formRule,
            editStatus,
          },
        });
    }
  };

  const handleSaveRules = async (type: string, serialMap: any) => {
    message.success('保存成功');
    const { mata, status, name } = serialMap;
    setResetRules(mata);
    setResetRuleName(name);
    if (type === 'inject') {
      setEditStatus(false);
      setErrors(false);
      return;
    }
    customRef.current.reset();
    handleTypeChange('inject');
    setEditStatus(false);
    setErrorsCustom(false);

    setRuleStatus(status);
    injectRef.current.reset(name);
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
          editStatus: false,
        },
      });
  };

  const handleCancelEdit = useMemoCallback(() => {
    injectRef.current.reset(resetRuleName);
    setEditStatus(false);
    setErrors(false);
    onChange &&
      onChange({
        serialId,
        serialMata: {
          id,
          type,
          ruleName,
          rules,
          changeRules: resetRules,
          changeRuleName: resetRuleName,
          editStatus: false,
        },
      });
  });

  const renderContent = useMemoCallback(() => {
    if (type === 'custom') {
      return (
        <CustomRule
          ref={customRef}
          rules={rules}
          ruleName={ruleName}
          type={type}
          id={id}
          isError={isErrorCustom}
          setErrors={setErrorsCustom}
          appId={data?.app?.id}
          onChange={handleOnChange}
          fields={fields}
          onSave={handleSaveRules}
        />
      );
    } else if (type === 'inject') {
      return (
        <InjectRule
          ref={injectRef}
          rules={changeRules}
          ruleName={changeRuleName}
          editStatus={editStatus}
          id={id}
          serialId={serialId}
          isError={isError}
          appId={data?.app?.id}
          onChange={handleOnChange}
          fields={fields}
          setErrors={setErrors}
          ruleStatus={ruleStatus}
          onSave={handleSaveRules}
          onCancelEdit={handleCancelEdit}
          onConfirmRule={handleConfirmRule}
          onEdit={handleEditRule}
        />
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
