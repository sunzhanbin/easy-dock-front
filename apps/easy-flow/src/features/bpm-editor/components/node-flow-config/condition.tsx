import { memo, FC } from "react";
import classNames from "classnames";
import { Form, Input, Select, Button, Tooltip, FormInstance } from "antd";
import { Icon } from "@common/components";
import { conditionSymbolMap } from "../../flow-design/util";
import styles from "./index.module.scss";

const typeList = [
  { value: "num", label: "数字" },
  { value: "text", label: "文本" },
  { value: "bool", label: "逻辑值" },
  { value: "date", label: "日期" },
  { value: "time", label: "时间" },
  { value: "dateTime", label: "日期+时间" },
  { value: "array", label: "数组" },
];

const {
  equal,
  unequal,
  greater,
  greaterOrEqual,
  less,
  lessOrEqual,
  include,
  exclude,
  stringLength,
  arrayLength,
  before,
  after,
  year,
  month,
  day,
  hour,
  minute,
  second,
  notNull,
} = conditionSymbolMap;

const symbolListMap: { [k: string]: { value: string; label: string }[] } = {
  num: [equal, unequal, greater, greaterOrEqual, less, lessOrEqual, conditionSymbolMap.null, notNull],
  text: [equal, unequal, include, exclude, stringLength, conditionSymbolMap.null, notNull],
  bool: [conditionSymbolMap.true, conditionSymbolMap.false, conditionSymbolMap.null, notNull],
  date: [equal, unequal, before, after, year, month, day, conditionSymbolMap.null, notNull],
  time: [equal, unequal, before, after, hour, minute, second, conditionSymbolMap.null, notNull],
  dateTime: [equal, unequal, before, after, year, month, day, minute, second, conditionSymbolMap.null, notNull],
  array: [include, exclude, arrayLength, conditionSymbolMap.null, notNull],
};

interface ConditionProps {
  name: string[];
}

type RemoveFn = (index: number) => void;

const Condition: FC<ConditionProps> = ({ name }) => {
  const handleTypeChange = (form: FormInstance, blockIndex: number, ruleIndex: number, type: string) => {
    const conditions = form.getFieldValue([...name]);
    const oldRuleBlock = conditions[blockIndex];
    const oldRuleItem = oldRuleBlock[ruleIndex];
    const ruleItem = Object.assign({}, oldRuleItem, {
      type,
      symbol: undefined,
      value: undefined,
    });
    oldRuleBlock.splice(ruleIndex, 1, ruleItem);
    conditions.splice(blockIndex, 1, oldRuleBlock);
    form.setFieldsValue({ [name[0]]: { [name[1]]: conditions } });
  };
  const handleSymbolChange = (
    form: FormInstance,
    blockIndex: number,
    ruleIndex: number,
    type: string,
    symbol: string,
  ) => {
    const conditions = form.getFieldValue([...name]);
    const oldRuleBlock = conditions[blockIndex];
    const oldRuleItem = oldRuleBlock[ruleIndex];
    const ruleItem = Object.assign({}, oldRuleItem, {
      type,
      symbol,
      value: undefined,
    });
    oldRuleBlock.splice(ruleIndex, 1, ruleItem);
    conditions.splice(blockIndex, 1, oldRuleBlock);
    form.setFieldsValue({ [name[0]]: { [name[1]]: conditions } });
  };
  const handleRemoveRule = (
    form: FormInstance,
    blockIndex: number,
    ruleIndex: number,
    removeBlock: RemoveFn,
    remove: RemoveFn,
  ) => {
    const conditionList = form.getFieldValue([...name]);
    const conditionBlock = form.getFieldValue([...name, blockIndex]);
    // 只剩一个条件时不允许删除
    if (conditionList?.length === 1 && conditionBlock?.length === 1) {
      return;
    }
    if (conditionBlock.length <= 1) {
      removeBlock(blockIndex);
    } else {
      remove(ruleIndex);
    }
  };
  return (
    <Form.Item noStyle shouldUpdate>
      <Form.List name={name}>
        {(fieldList, { add: addBlock, remove: removeBlock }) => {
          return (
            <>
              {fieldList.map((fieldItem, blockIndex) => {
                return (
                  <Form.Item noStyle shouldUpdate key={fieldItem.key}>
                    {(form: FormInstance) => {
                      const conditionList = form.getFieldValue([...name]);
                      return (
                        <div className={styles["rule-block"]}>
                          <Form.List name={[fieldItem.name]}>
                            {(fields, { add, remove }) => {
                              return (
                                <>
                                  {fields.map((field, fieldIndex) => {
                                    return (
                                      <div key={field.key} className={styles.condition}>
                                        <Form.Item
                                          name={[field.name, "params"]}
                                          className={styles.value}
                                          rules={[
                                            {
                                              validator(_, val: string) {
                                                if (!val || val.trim() === "") {
                                                  return Promise.reject(new Error("参数不能为空"));
                                                }

                                                return Promise.resolve();
                                              },
                                            },
                                          ]}
                                        >
                                          <Input size="large" placeholder="请输入参数" />
                                        </Form.Item>
                                        <Form.Item
                                          name={[field.name, "type"]}
                                          className={styles.symbol}
                                          rules={[
                                            {
                                              validator(_, val: string) {
                                                if (!val) {
                                                  return Promise.reject(new Error("参数类型不能为空"));
                                                }

                                                return Promise.resolve();
                                              },
                                            },
                                          ]}
                                        >
                                          <Select
                                            size="large"
                                            placeholder="参数类型"
                                            onChange={(type) => handleTypeChange(form, blockIndex, fieldIndex, type)}
                                          >
                                            {typeList.map(({ value, label }) => {
                                              return (
                                                <Select.Option key={value} value={value}>
                                                  {label}
                                                </Select.Option>
                                              );
                                            })}
                                          </Select>
                                        </Form.Item>
                                        <Form.Item noStyle shouldUpdate={true}>
                                          {(form: FormInstance) => {
                                            const conditionBlock = form.getFieldValue([...name, blockIndex]);
                                            const type = form.getFieldValue([...name, blockIndex, fieldIndex, "type"]);
                                            const symbolList = symbolListMap[type] || [];
                                            const shouldDisabled =
                                              conditionList?.length === 1 && conditionBlock?.length === 1;
                                            return (
                                              <>
                                                <Form.Item
                                                  name={[field.name, "symbol"]}
                                                  className={styles.symbol}
                                                  rules={[
                                                    {
                                                      validator(_, val: string) {
                                                        if (!val) {
                                                          return Promise.reject(new Error("判断符不能为空"));
                                                        }

                                                        return Promise.resolve();
                                                      },
                                                    },
                                                  ]}
                                                >
                                                  <Select
                                                    size="large"
                                                    placeholder="判断符"
                                                    onChange={(symbol) =>
                                                      handleSymbolChange(form, blockIndex, fieldIndex, type, symbol)
                                                    }
                                                  >
                                                    {symbolList.map(({ value, label }) => {
                                                      return (
                                                        <Select.Option key={value} value={value}>
                                                          {label}
                                                        </Select.Option>
                                                      );
                                                    })}
                                                  </Select>
                                                </Form.Item>
                                                <Form.Item
                                                  name={[field.name, "value"]}
                                                  className={styles.value}
                                                  rules={[
                                                    {
                                                      validator(_, val: string) {
                                                        if (!val || val.trim() === "") {
                                                          return Promise.reject(new Error("判断值不能为空"));
                                                        }

                                                        return Promise.resolve();
                                                      },
                                                    },
                                                  ]}
                                                >
                                                  <Input size="large" placeholder="请输入判断值" />
                                                </Form.Item>
                                                <Tooltip title="删除">
                                                  <span
                                                    className={classNames(
                                                      styles.delete,
                                                      shouldDisabled && styles.disabled,
                                                    )}
                                                    onClick={() =>
                                                      handleRemoveRule(
                                                        form,
                                                        blockIndex,
                                                        fieldIndex,
                                                        removeBlock,
                                                        remove,
                                                      )
                                                    }
                                                  >
                                                    <Icon type="shanchu" />
                                                  </span>
                                                </Tooltip>
                                              </>
                                            );
                                          }}
                                        </Form.Item>
                                      </div>
                                    );
                                  })}
                                  <Button className={styles.and} onClick={() => add()}>
                                    且条件
                                  </Button>
                                </>
                              );
                            }}
                          </Form.List>
                        </div>
                      );
                    }}
                  </Form.Item>
                );
              })}
              <Button className={styles.or} onClick={() => addBlock([{}])}>
                或条件
              </Button>
            </>
          );
        }}
      </Form.List>
    </Form.Item>
  );
};

export default memo(Condition);
