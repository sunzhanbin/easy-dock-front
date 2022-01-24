import { memo } from "react";
import { InputNumber, Select } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { TimingTrigger } from "@type/flow";
import styles from "./index.module.scss";

interface FrequencyProps {
  value?: TimingTrigger["frequency"];
  onChange?(value?: this["value"]): void;
}

function Frequency(props: FrequencyProps) {
  const { value, onChange } = props;

  const handleInput = useMemoCallback((ipv: number) => {
    if (onChange) {
      onChange(Object.assign({ value: ipv }, value));
    }
  });

  const handleUnitChange = useMemoCallback((unit) => {
    if (onChange) {
      onChange(Object.assign({ unit }, value));
    }
  });

  return (
    <div className={styles.frequency}>
      <InputNumber value={value?.value} onChange={handleInput} size="large" />
      <Select value={value?.unit} onChange={handleUnitChange} size="large" placeholder="请选择">
        <Select.Option key="天" value="天">
          天
        </Select.Option>
        <Select.Option key="周" value="周">
          周
        </Select.Option>
        <Select.Option key="月" value="月">
          月
        </Select.Option>
        <Select.Option key="年" value="年">
          年
        </Select.Option>
      </Select>
    </div>
  );
}

export default memo(Frequency);
