import { memo, useState, useCallback, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { FormRuleItem } from '@/type';
import { formatRuleValue } from '@/utils';
import { Icon } from '@common/components';
import FormAttrModal from '../form-attr-modal';
import styles from './index.module.scss';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { componentPropsSelector, formRulesSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { setFormRules } from '@/features/bpm-editor/form-design/formdesign-slice';

const FormAttrEditor = () => {
  const byId = useAppSelector(componentPropsSelector);
  const formRules = useAppSelector(formRulesSelector);
  const dispatch = useAppDispatch();
  const [rules, setRules] = useState<FormRuleItem[]>(formRules || []);
  const [currentRule, setCurrentRule] = useState<FormRuleItem | null>(null);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState<boolean>(false);
  // 组装tooltip文字内容(产品确认暂时不需要 2021-08-11)
  // const getText = useCallback(
  //   (rule: FormRuleItem) => {
  //     let text = '';
  //     if (rule.type === 'change') {
  //       const condition = rule!.formChangeRule!.fieldRule;
  //       const showComponentList = rule!.formChangeRule!.showComponents || [];
  //       const hideComponentList = rule!.formChangeRule!.hideComponents || [];
  //       const showComponents = showComponentList.map((id) => byId[id].label);
  //       const hideComponents = hideComponentList.map((id) => byId[id].label);
  //       text += '当';
  //       condition.forEach((ruleBlock, blockIndex) => {
  //         ruleBlock.forEach((item, index) => {
  //           const component = byId[item.fieldId] || {};
  //           const formatRule = formatRuleValue(item, component);
  //           text += `${formatRule?.name || ''}${formatRule?.symbol || ''}${formatRule?.value || ''}`;
  //           if (index !== ruleBlock.length - 1) {
  //             text += ' 且';
  //           }
  //         });
  //         if (blockIndex !== condition.length - 1) {
  //           text += ' 或';
  //         }
  //       });
  //       text += '时 ';
  //       if (showComponents.length > 0) {
  //         text += ' 显示';
  //         showComponents.forEach((name, index) => {
  //           text += name;
  //           if (index !== showComponents.length - 1) {
  //             text += '、';
  //           }
  //         });
  //       }
  //       if (hideComponents.length > 0) {
  //         text += ' 隐藏';
  //         hideComponents.forEach((name, index) => {
  //           text += name;
  //           if (index !== hideComponents.length - 1) {
  //             text += '、';
  //           }
  //         });
  //       }
  //       return text;
  //     }
  //     return text;
  //   },
  //   [byId],
  // );
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);
  const handleOk = useCallback(
    (rules, type, editIndex) => {
      setShowModal(false);
      let rule: FormRuleItem;
      if (rules.mode === 1) {
        // 值改变时
        rule = {
          type: 'change',
          formChangeRule: {
            fieldRule: rules.ruleValue,
            showComponents: rules.showComponents,
            hideComponents: rules.hideComponents,
          },
        };
      } else if (rules.mode === 2) {
        //进入表单时
        rule = {
          type: 'init',
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
    },
    [setShowModal],
  );
  const handleAddRule = useCallback(() => {
    setType('add');
    setCurrentRule(null);
    setShowModal(true);
  }, [setType, setCurrentRule, setShowModal]);
  const handleDeleteRule = useCallback(
    (index) => {
      setRules((rules) => {
        const list = [...rules];
        list.splice(index, 1);
        return list;
      });
    },
    [setRules],
  );
  const handleEditRule = useCallback(
    (index) => {
      const rule = rules[index];
      setType('edit');
      setEditIndex(index);
      setCurrentRule(rule);
      setShowModal(true);
    },
    [rules, setType, setCurrentRule, setShowModal, setEditIndex],
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
              const condition = item!.formChangeRule!.fieldRule;
              const showComponentList = item!.formChangeRule!.showComponents || [];
              const hideComponentList = item!.formChangeRule!.hideComponents || [];
              const showComponents = showComponentList.map((id) => byId[id]?.label || id);
              const hideComponents = hideComponentList.map((id) => byId[id]?.label || id);
              if (!condition) {
                return null;
              }
              return (
                <div className={styles.ruleItem} key={index}>
                  {/* <Tooltip placement="top" title={getText(item)}> */}
                  <div className={styles.content}>
                    <span>当</span>
                    {condition.map((ruleBlock, blockIndex) => {
                      return (
                        <span key={blockIndex}>
                          <span>
                            {ruleBlock.map((rule, ruleIndex) => {
                              const component = byId[rule.fieldId] || {};
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
                  {/* </Tooltip> */}
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
      {showModal && (
        <FormAttrModal type={type} rule={currentRule} editIndex={editIndex} onClose={handleClose} onOk={handleOk} />
      )}
    </div>
  );
};

export default memo(FormAttrEditor);
