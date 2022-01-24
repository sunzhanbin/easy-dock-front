import { useAppSelector } from "@/app/hooks";
import { componentPropsSelector } from "@/features/bpm-editor/form-design/formzone-reducer";
import { memo, useCallback, useMemo } from "react";
import { Select } from "antd";
import { OptionItem, SelectField } from "@/type";
import { Icon } from "@common/components";

const { Option } = Select;

interface editProps {
  id: string;
  value?: string;
  onChange?: (v: string) => void;
}

const SelectDefaultOption = (props: editProps) => {
  const { id, value, onChange } = props;
  const byId = useAppSelector(componentPropsSelector);
  const optionList = useMemo(() => {
    return (byId[id] as SelectField)?.dataSource?.data || [];
  }, [id, byId]);
  const isMultiple = useMemo(() => {
    return (byId[id] as SelectField)?.multiple;
  }, [id, byId]);
  const propList = useMemo(() => {
    const prop: { [k: string]: string | boolean } = { size: "large", placeholder: "请选择" };
    if (isMultiple) {
      prop.mode = "multiple";
    }
    if (value) {
      prop.defaultValue = value;
    }
    return prop;
  }, [isMultiple, value]);

  const handleChange = useCallback(
    (e) => {
      onChange && onChange(e);
    },
    [onChange],
  );
  return (
    <Select {...propList} onChange={handleChange} suffixIcon={<Icon type="xiala" />}>
      {optionList.map(({ key, value }: OptionItem) => (
        <Option value={key} key={key}>
          {value}
        </Option>
      ))}
    </Select>
  );
};

export default memo(SelectDefaultOption);
