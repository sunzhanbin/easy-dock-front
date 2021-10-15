import {memo, useState, useCallback, useEffect} from 'react';
import {Button, Tooltip, message} from 'antd';
import {FormField, FormRuleItem} from '@/type';
import {formatRuleValue} from '@/utils';
import {Icon} from '@common/components';
import FieldAttrModal from '../field-attr-modal';
import styles from './index.module.scss';
import {useAppSelector, useAppDispatch} from '@/app/hooks';
import {componentPropsSelector, fieldRulesSelector} from '@/features/bpm-editor/form-design/formzone-reducer';
import {setFieldRules} from '@/features/bpm-editor/form-design/formdesign-slice';

const FieldAttrEditor = () => {
  const byId = useAppSelector(componentPropsSelector);
  const fieldRules = useAppSelector(fieldRulesSelector);
  const dispatch = useAppDispatch();
  const [rules, setRules] = useState<FormRuleItem[]>(fieldRules || []);
  const [currentRule, setCurrentRule] = useState<FormRuleItem | null>(null);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);
  // TODO 这里禁止any，很难阅读，rules看起来是个数组却有mode属性
  const handleOk = useCallback((rules, type, editIndex) => {
    try {
      const subs: any[][] = rules.ruleValue || [];

      debugger
      if (subs.filter((item) => item.length !== 0).length !== 0) {
        setShowModal(false);
      } else {
        message.warning('配置条件不能为空');
      }
    } catch {
    }

    let rule: any;
    rule = {
      type: 'change',
      formChangeRule: {
        fieldRule: rules.ruleValue,
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
    console.log(444)
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
    dispatch(setFieldRules({fieldRules: rules}));
  }, [rules, dispatch]);
  useEffect(() => {
    if (fieldRules && fieldRules.length > 0) {
      setRules(fieldRules);
    }
  }, [fieldRules]);
  return (
    <div className={styles.container}>
      <div className={styles.rules}>
        <div className={styles.title}>日期逻辑规则</div>
        <div className={styles.content}>
          {rules.map((item: FormRuleItem, index: number) => {
            if (item.type === 'change') {
              const condition = item.formChangeRule!.fieldRule;
              if (!condition) {
                return null;
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
                              const component =
                                Object.values(byId).find((component) => component.fieldName === rule.fieldName) ||
                                ({} as FormField);
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
                    <span>
                      <span>显示</span>
                    </span>
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
        <Button className={styles.add} size="large" icon={<Icon type="xinzeng"/>} onClick={handleAddRule}>
          添加
        </Button>
      </div>
      {showModal && (
        <FieldAttrModal type={type} rule={currentRule} editIndex={editIndex} onClose={handleClose} onOk={handleOk}/>
      )}
    </div>
  );
};

export default memo(FieldAttrEditor);
