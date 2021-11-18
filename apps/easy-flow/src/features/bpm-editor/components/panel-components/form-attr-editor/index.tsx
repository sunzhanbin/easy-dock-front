import { memo, useState, useCallback, useEffect } from 'react';
import { Button, Tooltip, message } from 'antd';
import { EventType, FormChangeRule, FormField, FormRuleItem, TabsField } from '@/type';
import { formatRuleValue } from '@/utils';
import { Icon } from '@common/components';
import FormAttrModal from '../form-attr-modal';
import styles from './index.module.scss';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { componentPropsSelector, formRulesSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { setFormRules } from '@/features/bpm-editor/form-design/formdesign-slice';
import FieldAttrEditor from '@/features/bpm-editor/components/panel-components/field-attr-editor';

const FormAttrEditor = () => {
  const byId = useAppSelector(componentPropsSelector);
  const formRules = useAppSelector(formRulesSelector);
  const dispatch = useAppDispatch();
  const [rules, setRules] = useState<FormRuleItem[]>(formRules || []);
  const [currentRule, setCurrentRule] = useState<FormRuleItem | null>(null);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);
  const handleOk = useCallback((rules, type, editIndex) => {
    try {
      const subs: any[][] = rules.ruleValue || [];

      if (rules.mode === 2 || subs.filter((item) => item.length !== 0).length !== 0) {
        setShowModal(false);
      } else {
        message.warning('配置条件不能为空');
      }
    } catch {}

    let rule: FormRuleItem;
    if (rules.mode === 1) {
      const formChangeRule: FormChangeRule = { fieldRule: rules.ruleValue };
      if (rules.subtype === EventType.Visible) {
        formChangeRule.showComponents = rules.showComponents;
        formChangeRule.hideComponents = rules.hideComponents;
      } else if (rules.subtype === EventType.Union) {
        formChangeRule.interfaceConfig = rules.interfaceConfig;
      }
      // 值改变时
      rule = {
        type: 'change',
        subtype: rules.subtype,
        formChangeRule,
      };
    } else if (rules.mode === 2) {
      //进入表单时
      rule = {
        type: 'init',
        subtype: rules.subtype,
        formInitRule: rules.dataConfig,
      };
    }
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
    dispatch(setFormRules({ formRules: rules }));
  }, [rules, dispatch]);
  useEffect(() => {
    if (formRules && formRules.length > 0) {
      setRules(formRules);
    }
  }, [formRules]);
  return (
    <div className={styles.container}>
      <div className={styles.rules}>
        <div className={styles.title}>表单逻辑规则</div>
        <div className={styles.content}>
          {rules.map((item: FormRuleItem, index: number) => {
            if (item.type === 'change') {
              const condition = item.formChangeRule!.fieldRule;
              // 值改变时显示隐藏控件
              if (item.subtype === EventType.Visible) {
                const showComponentList = item.formChangeRule!.showComponents || [];
                const hideComponentList = item.formChangeRule!.hideComponents || [];
                let showComponents = showComponentList.map((fieldName) => {
                  const component = Object.values(byId).find((comp) => comp.fieldName === fieldName);
                  return component?.label || fieldName;
                });
                let hideComponents = hideComponentList.map((fieldName) => {
                  const component = Object.values(byId).find((comp) => comp.fieldName === fieldName);
                  return component?.label || fieldName;
                });
                if (!condition || condition.length < 1 || condition[0].length < 1) {
                  return null;
                }
                const parentId = condition.flat(2).filter((v) => v.fieldName)[0].parentId;
                if (parentId) {
                  const parent = Object.values(byId).find((v) => v.id === parentId);
                  if (parent) {
                    showComponents = showComponentList.map((fieldName) => {
                      const component = ((parent as TabsField).components || []).find(
                        (v) => v.config.fieldName === fieldName,
                      );
                      return component ? `${parent?.label}·${component?.config.label}` : fieldName;
                    });
                    hideComponents = hideComponentList.map((fieldName) => {
                      const component = ((parent as TabsField).components || []).find(
                        (v) => v.config.fieldName === fieldName,
                      );
                      return component ? `${parent?.label}·${component?.config.label}` : fieldName;
                    });
                  }
                }
                return (
                  <div className={styles.ruleItem} key={index}>
                    <div className={styles.content}>
                      <span>当</span>
                      {condition.map((ruleBlock, blockIndex) => {
                        return (
                          <span key={blockIndex}>
                            <span>
                              {ruleBlock.map((rule, ruleIndex) => {
                                let component =
                                  Object.values(byId).find((component) => component.fieldName === rule.fieldName) ||
                                  ({} as FormField);
                                if (rule?.parentId) {
                                  const parent = Object.values(byId).find((comp) => comp.id === rule.parentId);
                                  const sub = ((parent as TabsField)?.components || []).find(
                                    (v) => v.config.fieldName === rule.fieldName,
                                  );
                                  component = Object.assign({}, sub?.config, sub?.props, {
                                    label: `${parent?.label}·${sub?.config.label}`,
                                  }) as FormField;
                                }
                                const formatRule = formatRuleValue(rule, component);
                                return (
                                  <span key={ruleIndex}>
                                    <span className={styles.fieldName}>{formatRule?.name || ''}</span>
                                    <span>{formatRule?.symbol || ''}</span>
                                    <span className={styles.fieldName}>{formatRule?.value || ''}</span>
                                    {ruleIndex !== ruleBlock.length - 1 && <span>且</span>}
                                  </span>
                                );
                              })}
                            </span>
                            {blockIndex !== condition.length - 1 && <span>或</span>}
                          </span>
                        );
                      })}
                      <span className={styles.mr4}>时</span>
                      {showComponents.length > 0 && (
                        <span>
                          <span>显示</span>
                          <span className={styles.fieldName}>
                            {showComponents.map((name, index) => (
                              <span key={index}>
                                {name}
                                {index !== showComponents.length - 1 ? '、' : ''}
                              </span>
                            ))}
                          </span>
                        </span>
                      )}
                      {hideComponents.length > 0 && (
                        <span>
                          <span>隐藏</span>
                          <span className={styles.fieldName}>
                            {hideComponents.map((name, index) => (
                              <span key={index}>
                                {name}
                                {index !== hideComponents.length - 1 ? '、' : ''}
                              </span>
                            ))}
                          </span>
                        </span>
                      )}
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
              }
              // 值改变时调用接口
              if (item.subtype === EventType.Union) {
                const interfaceConfig = item.formChangeRule?.interfaceConfig;
                const interfaceName = interfaceConfig?.id || interfaceConfig?.url || '';
                return (
                  <div className={styles.ruleItem} key={index}>
                    <div className={styles.content}>
                      <span>当</span>
                      {condition.map((ruleBlock, blockIndex) => {
                        return (
                          <span key={blockIndex}>
                            <span>
                              {ruleBlock.map((rule, ruleIndex) => {
                                let component =
                                  Object.values(byId).find((component) => component.fieldName === rule.fieldName) ||
                                  ({} as FormField);
                                if (rule?.parentId) {
                                  const parent = Object.values(byId).find((comp) => comp.id === rule.parentId);
                                  const sub = ((parent as TabsField)?.components || []).find(
                                    (v) => v.config.fieldName === rule.fieldName,
                                  );
                                  component = Object.assign({}, sub?.config, sub?.props, {
                                    label: `${parent?.label}·${sub?.config.label}`,
                                  }) as FormField;
                                }
                                const formatRule = formatRuleValue(rule, component);
                                return (
                                  <span key={ruleIndex}>
                                    <span className={styles.fieldName}>{formatRule?.name || ''}</span>
                                    <span>{formatRule?.symbol || ''}</span>
                                    <span className={styles.fieldName}>{formatRule?.value || ''}</span>
                                    {ruleIndex !== ruleBlock.length - 1 && <span>且</span>}
                                  </span>
                                );
                              })}
                            </span>
                            {blockIndex !== condition.length - 1 && <span>或</span>}
                          </span>
                        );
                      })}
                      <span className={styles.mr4}>时</span>
                      <span>读取接口</span>
                      <span className={styles.fieldName}>{interfaceName}</span>
                      <span>数据</span>
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
              }
              return null;
            } else if (item.type === 'init') {
              return (
                <div className={styles.ruleItem} key={index}>
                  <div className={styles.content}>
                    <span>当</span>
                    <span className={styles.fieldName}>进入表单时</span>
                    <span>读取接口</span>
                    <span className={styles.fieldName}>{item.formInitRule?.id || item.formInitRule?.url}</span>
                    <span>数据</span>
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
            }
            return null;
          })}
        </div>
        <Button className={styles.add} size="large" icon={<Icon type="xinzeng" />} onClick={handleAddRule}>
          添加
        </Button>
      </div>
      <FieldAttrEditor />
      {showModal && (
        <FormAttrModal type={type} rule={currentRule} editIndex={editIndex} onClose={handleClose} onOk={handleOk} />
      )}
    </div>
  );
};

export default memo(FormAttrEditor);
