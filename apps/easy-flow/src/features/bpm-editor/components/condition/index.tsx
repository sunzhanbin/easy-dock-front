import { memo, useCallback, useMemo } from 'react';
import { Tooltip, Button } from 'antd';
import classnames from 'classnames';
import FormList from './form-list';
import { Icon } from '@common/components';
import { fieldRule, FormField } from '@/type';
import styles from './index.module.scss';

interface EditProps {
  data: Array<FormField>;
  name: string;
  showTabs?: boolean; // 是否显示Tabs子控件
  className?: string;
  value?: fieldRule[][];
  onChange?: (value: fieldRule[][]) => void;
  isFormRule?: boolean;
  loadDataSource?: (
    id: string,
    parentId?: string,
  ) => Promise<{ key: string; value: string }[] | { data: { data: string[] } }>;
}

// 不能作为条件的控件类型
let excludeTypes = ['DescText', 'SerialNum', 'FlowData'];

const Condition = ({
  className,
  data,
  value,
  name,
  showTabs = true,
  onChange,
  loadDataSource,
  isFormRule = true,
}: EditProps) => {
  const ruleList = useMemo(() => {
    if (value && value.length > 0) {
      return value;
    }
    return [[{ fieldName: undefined, symbol: undefined }]];
  }, [value]);
  const components = useMemo(() => {
    if (!Array.isArray(data) || data.length < 1) {
      return [];
    }
    const componentList: any[] = [];
    if (!showTabs) {
      excludeTypes.push('Tabs');
      data.filter((v) => !excludeTypes.includes(v.type)).forEach((item) => componentList.push(item));
      return componentList;
    }
    const list = ruleList.flat(2).filter((v) => v.fieldName);
    excludeTypes = excludeTypes.filter((v) => v !== 'Tabs');
    if (list.length < 1) {
      // 还没有选择控件
      data
        .filter((item) => !excludeTypes.includes(item.type))
        .forEach((item) => {
          if (item.type === 'Tabs') {
            (item?.components || []).forEach((v) => {
              componentList.push(Object.assign({}, v.config, v.props, { label: `${item.label}·${v.config.label}` }));
            });
          } else {
            componentList.push(item);
          }
        });
    } else {
      const parentId = list[0].parentId;
      // 选择了tabs内的控件
      if (parentId) {
        data.forEach((item) => {
          if (item.type === 'Tabs') {
            (item?.components || []).forEach((v) => {
              componentList.push(Object.assign({}, v.config, v.props, { label: `${item.label}·${v.config.label}` }));
            });
          }
        });
      } else {
        excludeTypes.push('Tabs');
        // 选择了tabs外的控件
        data.filter((v) => !excludeTypes.includes(v.type)).forEach((item) => componentList.push(item));
      }
    }
    return componentList;
  }, [data, ruleList, showTabs]);
  const addRule = useCallback(
    (index: number) => {
      const list = [...ruleList];
      const result = list.map((ruleBlock, blockIndex) => {
        if (index === blockIndex) {
          const block = [...ruleBlock];
          block.push({ fieldName: undefined, symbol: undefined });
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
    list.push([{ fieldName: undefined, symbol: undefined }]);
    onChange && onChange(list);
  }, [ruleList, onChange]);
  const handleRuleChange = useCallback(
    (blockIndex: number, ruleIndex: number, rule: fieldRule) => {
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
        {ruleList.map((ruleBlock: fieldRule[], index: number) => {
          if (ruleBlock.length === 0) {
            return null;
          }
          return (
            <div key={index}>
              {index !== 0 && <div className={styles.or}>或</div>}
              <div className={styles.ruleBlock}>
                {ruleBlock.map((rule: fieldRule, ruleIndex: number) => {
                  return (
                    <div className={styles.rule} key={ruleIndex}>
                      <FormList
                        rule={rule}
                        components={components}
                        className={styles.form}
                        name={name}
                        blockIndex={index}
                        ruleIndex={ruleIndex}
                        isFormRule={isFormRule}
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
            </div>
          );
        })}
        {isFormRule && (
          <Button className={styles.addOr} type="default" icon={<Icon type="xinzeng" />} onClick={addRuleBlock}>
            或条件
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(Condition);
