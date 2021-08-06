import { memo, useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import RuleForm from '@components/rule-form';
import { Icon } from '@common/components';
import { filedRule } from '@/type';
import styles from './index.module.scss';

interface EditProps {
  components: Array<any>; //暂时使用any类型
  className?: string;
  value?: filedRule[][];
  onChange?: (value: filedRule[][]) => void;
  loadDataSource?: (id: string) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
}

const Condition = ({ className, components, value, onChange, loadDataSource }: EditProps) => {
  const [ruleList, setRuleList] = useState<filedRule[][]>(value || [[{ field: '', symbol: '' }]]);
  const addRule = useCallback(
    (index: number) => {
      const list = [...ruleList];
      const ruleBlock = list[index];
      ruleBlock.push({ field: '', symbol: '' });
      setRuleList(list);
    },
    [ruleList, setRuleList],
  );
  const deleteRule = useCallback(
    (blockIndex, ruleIndex) => {
      const list = [...ruleList];
      const ruleBlock = list[blockIndex];
      ruleBlock.splice(ruleIndex, 1);
      setRuleList(list);
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
      const list = [...ruleList];
      const ruleBlock = list[blockIndex];
      ruleBlock[ruleIndex] = rule;
      setRuleList(list);
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
