import { memo, useContext } from "react";
import { Form, Select } from "antd";
import { Location as LocationType } from "@type/api";
import DataContext from "../context";
import styles from "../index.module.scss";

interface LocationProps {
  disabled?: boolean;
  name: (string | number)[];
}

function Location(props: LocationProps) {
  const { name, disabled } = props;
  const { layout, getPopupContainer } = useContext(DataContext)!;

  return (
    <Form.Item
      name={name}
      isListField
      className={styles.location}
      style={{ paddingBottom: layout === "vertical" ? 6 : 12 }}
      rules={[
        {
          validator(_, val) {
            if (!val) return Promise.reject(new Error("请求位置不能为空"));

            return Promise.resolve();
          },
        },
      ]}
    >
      <Select
        placeholder="请求位置"
        dropdownStyle={{ width: 100 }}
        disabled={disabled}
        dropdownMatchSelectWidth={false}
        getPopupContainer={getPopupContainer}
        size={layout === "vertical" ? "small" : "large"}
      >
        <Select.Option value={LocationType.HEAD}>请求头</Select.Option>
        <Select.Option value={LocationType.BODY}>请求体</Select.Option>
        <Select.Option value={LocationType.QUERY}>QUERY</Select.Option>
        <Select.Option value={LocationType.PATH}>路径</Select.Option>
      </Select>
    </Form.Item>
  );
}

export default memo(Location);
