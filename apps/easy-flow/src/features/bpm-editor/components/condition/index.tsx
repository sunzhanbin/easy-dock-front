import { memo, useCallback, useMemo } from 'react';
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
  const ruleList = useMemo(() => {
    if (value && value.length > 0) {
      return value;
    }
    return [[{ fieldId: '', symbol: '' }]];
  }, [value]);
  const components = useMemo(() => {
    return data || [];
  }, [data]);
  const addRule = useCallback(
    (index: number) => {
      const list = [...ruleList];
      const result = list.map((ruleBlock, blockIndex) => {
        if (index === blockIndex) {
          const block = [...ruleBlock];
          block.push({ fieldId: '', symbol: '' });
          return block;
        }
        return ruleBlock;
      });
      onChange && onChange(result);
    },
    [ruleList, onChange],
  );
  const deleteRule = useCallback(
    (blockIndex, ruleIndex) => {
      const list = [...ruleList];
      const result = list.map((ruleBlock, index) => {
        if (index === blockIndex) {
          const block = [...ruleBlock];
          block.splice(ruleIndex, 1);
          return block;
        }
        return ruleBlock;
      });
      onChange && onChange(result);
    },
    [ruleList, onChange],
  );
  const addRuleBlock = useCallback(() => {
    const list = [...ruleList];
    list.push([{ fieldId: '', symbol: '' }]);
    onChange && onChange(list);
  }, [ruleList, onChange]);
  const handleRuleChange = useCallback(
    (blockIndex, ruleIndex, rule) => {
      const list = [...ruleList];
      const result = list.map((ruleBlock, index) => {
        if (index === blockIndex) {
          return ruleBlock.map((item, i) => {
            if (i === ruleIndex) return rule;
            return item;
          });
        }
        return ruleBlock;
      });
      onChange && onChange(result);
    },
    [ruleList, onChange],
  );
  return (
    <div className={classnames(styles.condition, className ? className : '')}>
      <div className={styles.ruleList}>
        {ruleList.map((ruleBlock: filedRule[], index: number) => (
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
                    <Tooltip title="删除">
                      <span
                        className={styles.delete}
                        onClick={() => {
                          deleteRule(index, ruleIndex);
                        }}
                      >
                        <Icon type="shanchu" />
                      </span>
                    </Tooltip>
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
        ))}
        <Button className={styles.addOr} type="default" icon={<Icon type="xinzeng" />} onClick={addRuleBlock}>
          或条件
        </Button>
      </div>
    </div>
  );
};

export default memo(Condition);
