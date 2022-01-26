import { memo, useContext, useMemo } from "react";
import { Form, Input, Dropdown, Menu, Select } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "./index.module.scss";
import DataContext from "../context";

interface FieldMapProps {
  name: (string | number)[];
  isAutoSelect?: boolean; // 是否可输可选,默认为true
}

function FieldMap(props: FieldMapProps) {
  const { name, isAutoSelect = true } = props;
  const { fields } = useContext(DataContext)!;
  const options = useMemo(() => {
    return fields.map((item) => {
      if (isAutoSelect) {
        return {
          name: item.name,
          id: `\${${item.id}}`,
        };
      }
      return item;
    });
  }, [fields, isAutoSelect]);
  return (
    <Form.Item
      name={name}
      isListField
      style={{ paddingBottom: 12 }}
      rules={[
        {
          validator(_, val: string) {
            if (!val) {
              return Promise.reject(new Error("映射字段不能为空"));
            }

            return Promise.resolve();
          },
        },
      ]}
      trigger="onChange"
    >
      {isAutoSelect ? (
        <AutoSelector options={options} />
      ) : (
        <Select size="large" placeholder="请选择" getPopupContainer={(node) => node} dropdownMatchSelectWidth={false}>
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
  );
}

export default memo(FieldMap);

interface AutoSelectorProps {
  value?: string;
  onChange?(value: this["value"]): void;
  options: { id: string | number; name: string }[];
}

export function AutoSelector(props: AutoSelectorProps) {
  const { options, value, onChange } = props;
  const showValue = useMemo(() => {
    return options.find((item) => item.id === value)?.name || value;
  }, [options, value]);

  const handleMenuClick = useMemoCallback(({ key }: { key: string }) => {
    onChange!(key);
  });

  const handleInputChange = useMemoCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange!(event.target.value);
  });

  return (
    <Dropdown
      getPopupContainer={(c) => c}
      overlay={
        <Menu className={styles.options} onClick={handleMenuClick}>
          {options.map((item) => {
            return (
              <Menu.Item key={item.id} className={item.id === value ? styles["field-selected"] : ""}>
                {item.name}
              </Menu.Item>
            );
          })}
        </Menu>
      }
      trigger={["click"]}
    >
      <div className={styles.selector}>
        <Input size="large" value={showValue || value} onInput={handleInputChange} placeholder="请输入" />
      </div>
    </Dropdown>
  );
}
