import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import RuleForm from '@components/rule-form';
import { Icon } from '@common/components';
import { ComponentConfig, filedRule, FormField } from '@/type';
import styles from './index.module.scss';

interface EditProps {
  data: Array<ComponentConfig | FormField>;
  className?: string;
  value?: filedRule[][];
  onChange?: (value: filedRule[][]) => void;
  loadDataSource?: (id: string) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
}

const Condition = ({ className, data, value, onChange, loadDataSource }: EditProps) => {
  const [ruleList, setRuleList] = useState<filedRule[][]>(value || [[{ field: '', symbol: '' }]]);
  const components = useMemo(() => {
    if (data.length > 0) {
      if ((data[0] as ComponentConfig).config) {
        return data.map((item) => {
          const { config, props } = item as ComponentConfig;
          return [{ ...config, ...props }];
        });
      }
      return data;
    }
    return [];
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
                  <div
                    className={styles.and}
                    onClick={() => {
                      addRule(index);
                    }}
                  >
                    <span className={styles.add}>
                      <Icon type="xinzeng" />
                    </span>
                    <span>且条件</span>
                  </div>
                </div>
                {index !== ruleList.length - 1 && <div className={styles.or}>或</div>}
              </div>
            );
          })}
        <div className={styles.addOr} onClick={addRuleBlock}>
          <span className={styles.add}>
            <Icon type="xinzeng" />
          </span>
          <span>或条件</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Condition);
