import { memo, useState, useCallback } from 'react';
import { Button, Tooltip } from 'antd';
import { FormRuleItem } from '@/type';
import { formatCondition } from '@/utils';
import { Icon } from '@common/components';
import FormAttrModal from '../form-attr-modal';
import styles from './index.module.scss';
import { useAppSelector } from '@/app/hooks';
import { componentPropsSelector } from '@/features/bpm-editor/form-design/formzone-reducer';

const FormAttrEditor = () => {
  const byId = useAppSelector(componentPropsSelector);
  const [rules, setRules] = useState<FormRuleItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);
  const handleOk = useCallback(
    (rules) => {
      setShowModal(false);
      // 值改变时
      if (rules.mode === 1) {
        const rule: FormRuleItem = {
          type: 'change',
          formChangeRule: {
            filedRule: rules.ruleValue,
            showComponents: rules.showComponents,
            hideComponents: rules.hideComponents,
          },
        };
        console.info(rules.ruleValue, 111);
        setRules((rules) => {
          rules.push(rule);
          return rules;
        });
      }
    },
    [setShowModal],
  );
  return (
    <div className={styles.container}>
      <div className={styles.rules}>
        <div className={styles.title}>表单逻辑规则</div>
        <div className={styles.content}>
          {rules.map((item: FormRuleItem, index: number) => {
            if (item.type === 'change') {
              const condition = formatCondition(item!.formChangeRule!.filedRule);
              const showComponentList = item!.formChangeRule!.showComponents || [];
              const hideComponentList = item!.formChangeRule!.hideComponents || [];
              const showComponents = showComponentList.map((id) => byId[id].label);
              const hideComponents = hideComponentList.map((id) => byId[id].label);
              return (
                <div className={styles.ruleItem} key={index}>
                  <div className={styles.content}>
                    <span>当</span>
                    {condition.map((ruleBlock, blockIndex) => {
                      return (
                        <span key={blockIndex}>
                          <span>
                            {ruleBlock.map((rule, ruleIndex) => {
                              return (
                                <span key={ruleIndex}>
                                  <span className={styles.fieldName}>{rule.fieldName}</span>
                                  <span>{`${rule.symbol}${rule.value}`}</span>
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
                        <Icon type="bianji" className={styles.edit} />
                      </span>
                    </Tooltip>
                    <Tooltip title="删除">
                      <span>
                        <Icon type="shanchu" className={styles.delete} />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <Button className={styles.add} size="large" icon={<Icon type="xinzeng" />} onClick={handleShowModal}>
          添加
        </Button>
      </div>
      {showModal && <FormAttrModal onClose={handleClose} onOk={handleOk} />}
    </div>
  );
};

export default memo(FormAttrEditor);
