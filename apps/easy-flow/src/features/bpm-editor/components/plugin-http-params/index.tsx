import { memo, FC, useMemo } from "react";
import { Form, Input, Select } from "antd";
import { useAppSelector } from "@/app/hooks";
import { AutoSelector } from "../data-api-config/components/map";
import { formMetaSelector } from "../../flow-design/flow-slice";
import styles from "./index.module.scss";

interface PluginHttpParamsProps {
  name: string[];
  text?: string;
  label?: string;
}

const PluginHttpParams: FC<PluginHttpParamsProps> = ({ name, label, text = "来自" }) => {
  const formMeta = useAppSelector(formMetaSelector);
  const options = useMemo(() => {
    return (formMeta?.components || [])
      .filter((item) => !["DescText", "Tabs"].includes(item.config.type))
      .map((item) => ({ name: item.config.label as string, id: item.config.fieldName }))
      .map((v) => {
        if (text === "来自") {
          return {
            name: v.name,
            id: `\${${v.id}}`,
          };
        }
        return v;
      });
  }, [formMeta, text]);
  return (
    <Form.Item noStyle shouldUpdate>
      {label && <div className={styles.label}>{label}</div>}
      <Form.List name={name}>
        {(fields) => (
          <>
            {fields.map((field) => {
              return (
                <Form.Item key={field.key} noStyle shouldUpdate>
                  {(form) => {
                    const required = form.getFieldValue([...name, field.name, "required"]);
                    return (
                      <div className={styles["params-config"]}>
                        <div className={styles.required}>{required && "*"}</div>
                        <Form.Item name={[field.name, "name"]} className={styles.name}>
                          <Input size="large" disabled />
                        </Form.Item>
                        <Form.Item name={[field.name, "key"]} hidden={true}>
                          <Input size="large" disabled />
                        </Form.Item>
                        <div className={styles.text}>{text}</div>
                        <Form.Item
                          name={[field.name, "map"]}
                          className={styles.map}
                          rules={[
                            {
                              validator(_, val: string) {
                                if (!val && required) {
                                  return Promise.reject(new Error("映射字段不能为空"));
                                }

                                return Promise.resolve();
                              },
                            },
                          ]}
                          trigger="onChange"
                        >
                          {text === "来自" ? (
                            <AutoSelector options={options} />
                          ) : (
                            <Select size="large" placeholder="请选择" getPopupContainer={(node) => node}>
                              {options.map((v) => {
                                return (
                                  <Select.Option key={v.id} value={v.id}>
                                    {v.name}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.Item>
              );
            })}
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default memo(PluginHttpParams);
