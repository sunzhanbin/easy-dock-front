import { memo, ReactNode, useMemo } from "react";
import { Select } from "antd";
import { OptionItem } from "@/type";
import { SelectProps } from "antd/lib/select";
import { Icon } from "@common/components";

const { Option } = Select;

const SelectComponent = (
  props: SelectProps<string> & {
    readOnly: boolean;
    multiple: boolean;
    options: OptionItem;
  },
) => {
  const { defaultValue, multiple, showSearch, options, onChange } = props;

  const propList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const prop: { [k: string]: string | boolean | Function | ReactNode } = {
      size: "large",
      showSearch: showSearch as boolean,
      placeholder: "请选择",
      suffixIcon: <Icon type="xiala" />,
      // eslint-disable-next-line @typescript-eslint/ban-types
      onChange: onChange as Function,
    };
    if (multiple) {
      prop.mode = "multiple";
    }
    if (defaultValue) {
      prop.defaultValue = defaultValue;
    }
    const { options, ...others } = props;
    const result = Object.assign({}, others, prop);
    delete result.fieldName;
    delete result.colSpace;
    delete result.dataSource;
    return result;
  }, [defaultValue, multiple, showSearch, props, onChange]);
  return (
    <Select {...propList} style={{ width: "100%" }}>
      {(options || []).map(({ key, value }) => (
        <Option value={key as string} key={key}>
          {value}
        </Option>
      ))}
    </Select>
  );
};

export default memo(SelectComponent);
