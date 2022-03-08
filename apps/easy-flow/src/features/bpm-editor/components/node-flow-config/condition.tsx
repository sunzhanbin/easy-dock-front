import { memo, FC } from "react";
import { Form, Input, Select, Button, Tooltip } from "antd";
import { symbolMap } from "@/utils";
import styles from "./index.module.scss";
import { Icon } from "@common/components";

const symbolList = [symbolMap.equal, symbolMap.unequal];

interface ConditionProps {
  name: string[];
}

const Condition: FC<ConditionProps> = ({ name }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      <Form.List name={name}>
        {(fieldList, { add: addBlock, remove: removeBlock }) => {
          return (
            <>
              {fieldList.map((fieldItem) => {
                return (
                  <Form.Item noStyle shouldUpdate key={fieldItem.key}>
                    {(form) => {
                      return (
                        <div className={styles["rule-block"]}>
                          <Form.List name={[fieldItem.name]}>
                            {(fields, { add, remove }) => {
                              return (
                                <>
                                  {fields.map((field) => {
                                    return (
                                      <div key={field.key} className={styles.condition}>
                                        <Form.Item name={[field.name, "fieldName"]} className={styles.fieldName}>
                                          <Input size="large" placeholder="关联字段" />
                                        </Form.Item>
                                        <Form.Item name={[field.name, "symbol"]} className={styles.symbol}>
                                          <Select size="large" placeholder="判断符">
                                            {symbolList.map(({ value, label }) => {
                                              return <Select.Option key={value}>{label}</Select.Option>;
                                            })}
                                          </Select>
                                        </Form.Item>
                                        <Form.Item name={[field.name, "value"]} className={styles.value}>
                                          <Input size="large" placeholder="请输入" />
                                        </Form.Item>
                                        <Tooltip title="删除">
                                          <span className={styles.delete}>
                                            <Icon type="shanchu" />
                                          </span>
                                        </Tooltip>
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
