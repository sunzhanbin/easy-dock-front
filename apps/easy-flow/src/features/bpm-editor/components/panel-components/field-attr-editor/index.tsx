import { memo, useState, useCallback, useEffect } from 'react';
import { Button, Tooltip, message } from 'antd';
import { EventType, FormField, PropertyRuleItem } from '@/type';
import { flowVarsMap, formatRuleValue } from '@/utils';
import { Icon } from '@common/components';
import FieldAttrModal from '../field-attr-modal';
import styles from '../form-attr-editor/index.module.scss';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { componentPropsSelector, propertyRulesSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { setPropertyRules } from '@/features/bpm-editor/form-design/formdesign-slice';

const FieldAttrEditor = () => {
  const byId = useAppSelector(componentPropsSelector);
  const propertyRules = useAppSelector(propertyRulesSelector);
  const dispatch = useAppDispatch();
  const [rules, setRules] = useState<PropertyRuleItem[]>(propertyRules || []);
  const [currentRule, setCurrentRule] = useState<PropertyRuleItem | null>(null);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);
  const handleOk = useCallback((rules, type, editIndex) => {
    try {
      const subs: any[][] = rules.propertyValue || [];
      if (subs.filter((item) => item.length !== 0).length !== 0) {
        setShowModal(false);
      } else {
        message.warning('配置条件不能为空');
      }
    } catch {}

    let rule = {
      type: 'change',
      subtype: EventType.Union, // 运行端事件联动处理
      formChangeRule: {
        fieldRule: rules.propertyValue,
      },
    };
    if (type === 'add') {
      setRules((rules) => {
        const list = [...rules];
        list.push(rule);
        return list;
      });
    } else {
      setRules((rules) => {
        return rules.map((item, index) => {
          if (index === editIndex) {
            return rule;
          }
          return item;
        });
      });
    }
  }, []);
  const handleAddRule = useCallback(() => {
    setType('add');
    setCurrentRule(null);
    setShowModal(true);
  }, []);
  const handleDeleteRule = useCallback((index) => {
    setRules((rules) => {
      const list = [...rules];
      list.splice(index, 1);
      return list;
    });
  }, []);
  const handleEditRule = useCallback(
    (index) => {
      const rule = rules[index];
      setType('edit');
      setEditIndex(index);
      setCurrentRule(rule);
      setShowModal(true);
    },
    [rules],
  );
  useEffect(() => {
    dispatch(setPropertyRules({ propertyRules: rules }));
  }, [rules, dispatch]);
  useEffect(() => {
    if (propertyRules && propertyRules.length > 0) {
      setRules(propertyRules);
    }
  }, [propertyRules]);
  return (
    <>
      <div className={styles.rules}>
        <div className={styles.title}>表单静态规则</div>
        <div className={styles.content}>
          {rules.map((item: PropertyRuleItem, index: number) => {
            const condition = item.formChangeRule!.fieldRule;
            if (!condition || !condition.length) {
              return null;
            }
            return (
              <div className={styles.ruleItem} key={index}>
                <div className={styles.content}>
                  {condition.map((ruleBlock, blockIndex) => {
                    return (
                      <span key={blockIndex}>
                        <>
                          {ruleBlock.map((rule, ruleIndex) => {
                            const componentPrev =
                              Object.values(byId).find((component) => component.fieldName === rule.fieldName) ||
                              ({} as FormField);
                            const componentNext =
                              rule.valueType === 'other'
                                ? Object.values(byId).find((component) => component.fieldName === rule.value) ||
                                  ({} as FormField)
                                : Object.values(flowVarsMap).find((item) => item.value === rule.value) ||
                                  ({} as FormField);
                            const formatRule = formatRuleValue(rule, componentPrev, componentNext);
                            return (
                              <span key={ruleIndex}>
                                <span className={styles.fieldName}>{formatRule?.name || ''}</span>
                                <span>{formatRule?.symbol || ''}</span>
                                <span className={styles.fieldName}>{formatRule.value || ''}</span>
                                {ruleIndex !== ruleBlock.length - 1 && <span>且</span>}
                              </span>
                            );
                          })}
                        </>
                      </span>
                    );
                  })}
                </div>
                <div className={styles.operation}>
                  <Tooltip title="编辑">
                    <span>
                      <Icon
                        type="bianji"
                        className={styles.edit}
                        onClick={() => {
                          handleEditRule(index);
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="删除">
                    <span>
                      <Icon
                        type="shanchu"
                        className={styles.delete}
                        onClick={() => {
                          handleDeleteRule(index);
                        }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <Button className={styles.add} size="large" icon={<Icon type="xinzeng" />} onClick={handleAddRule}>
          添加
        </Button>
      </div>
      {showModal && (
        <FieldAttrModal type={type} rule={currentRule} editIndex={editIndex} onClose={handleClose} onOk={handleOk} />
      )}
    </>
  );
};

export default memo(FieldAttrEditor);
