import { memo, FC, useMemo } from "react";
import { Select } from "antd";
import { Icon } from "@common/components";
import { useAppSelector } from "@/app/hooks";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "./index.module.scss";
import { formMetaSelector } from "../../flow-design/flow-slice";

interface BackFillComponentProps {
  value?: string;
  onChange?: (value: this["value"]) => void;
}

const { Option } = Select;

const BackFillComponent: FC<BackFillComponentProps> = ({ value, onChange }) => {
  const formMeta = useAppSelector(formMetaSelector);
  const components = useMemo(() => {
    return Object.values(formMeta?.components || {})
      .map((v) => v.config)
      .filter((v) => v.type === "InputNumber");
  }, [formMeta]);
  const handleChange = useMemoCallback((val) => {
    onChange && onChange(val);
  });
  return (
    <div className={styles.container}>
      <div className={styles.text}>超时时间回填至</div>
      <div className={styles.component}>
        <Select
          allowClear
          size="large"
          placeholder="请选择"
          suffixIcon={<Icon type="xiala" />}
          defaultValue={value}
          getPopupContainer={(node) => node}
          onChange={handleChange}
        >
          {components.map((com) => (
            <Option key={com.fieldName} value={com.fieldName}>
              {com.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default memo(BackFillComponent);
