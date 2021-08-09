import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { Tooltip, Button } from 'antd';
import classnames from 'classnames';
import RuleForm from '@/features/bpm-editor/components/rule-form';
import { Icon } from '@common/components';
import { filedRule, FormField } from '@/type';
import styles from './index.module.scss';

interface EditProps {
  data: Array<FormField>;
  className?: string;
  value?: filedRule[][];
  onChange?: (value: filedRule[][]) => void;
  loadDataSource?: (id: string) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
}

const Condition = ({ className, data, value, onChange, loadDataSource }: EditProps) => {
  const [ruleList, setRuleList] = useState<filedRule[][]>(value || [[{ field: '', symbol: '' }]]);
  const components = useMemo(() => {
    return data || [];
  }, [data]);
  const addRule = useCallback(
    (index: number) => {
      setRuleList((list) => {
        return list.map((ruleBlock, blockIndex) => {
          if (index === blockIndex) {
            ruleBlock.push({ field: '', symbol: '' });
          }
          return ruleBlock;
        });
      });
    },
    [ruleList, setRuleList],
  );
  const deleteRule = useCallback(
    (blockIndex, ruleIndex) => {
      setRuleList((list) => {
        return list.map((ruleBlock, index) => {
          if (index === blockIndex) {
            ruleBlock.splice(ruleIndex, 1);
          }
          return ruleBlock;
        });
      });
    },
    [ruleList, setRuleList],
  );
  const addRuleBlock = useCallback(() => {
    const list = [...ruleList];
    list.push([{ field: '', symbol: '' }]);
    setRuleList(list);
  }, [ruleList, setRuleList]);
  const handleRuleChange = useCallback(
    (blockIndex, ruleIndex, rule) => {
      setRuleList((list) => {
        return list.map((ruleBlock, index) => {
          if (index === blockIndex) {
            return ruleBlock.map((item, i) => {
              if (i === ruleIndex) return rule;
              return item;
            });
          }
          return ruleBlock;
        });
      });
    },
    [ruleList, setRuleList],
  );
  useEffect(() => {
    if (ruleList.length > 0) {
      onChange && onChange(ruleList);
    }
  }, [ruleList, onChange]);
  return (
    <div className={classnames(styles.condition, className ? className : '')}>
      <div className={styles.ruleList}>
        {ruleList.length > 0 &&
          ruleList.map((ruleBlock: filedRule[], index: number) => {
            {
              if (ruleBlock.length > 0) {
                return (
                  <div key={index}>
                    <div className={styles.ruleBlock}>
                      {ruleBlock.map((rule: filedRule, ruleIndex: number) => {
                        return (
                          <div className={styles.rule} key={ruleIndex}>
                            <RuleForm
                              rule={rule}
                              components={components}
                              className={styles.form}
                              blockIndex={index}
                              ruleIndex={ruleIndex}
                              onChange={handleRuleChange}
                              loadDataSource={loadDataSource}
                            />
                            <span
                              className={styles.delete}
                              onClick={() => {
                                deleteRule(index, ruleIndex);
                              }}
                            >
                              <Tooltip title="删除">
                                <span>
                                  <Icon type="shanchu" />
                                </span>
                              </Tooltip>
                            </span>
                          </div>
                        );
                      })}
                      <Button
                        className={styles.and}
                        type="default"
                        icon={<Icon type="xinzeng" />}
                        onClick={() => {
                          addRule(index);
                        }}
                      >
                        且条件
                      </Button>
                    </div>
                    {index !== ruleList.length - 1 && <div className={styles.or}>或</div>}
                  </div>
                );
              }
              return null;
            }
          })}
        <Button className={styles.addOr} type="default" icon={<Icon type="xinzeng" />} onClick={addRuleBlock}>
          或条件
        </Button>
      </div>
    </div>
  );
};

export default memo(Condition);
