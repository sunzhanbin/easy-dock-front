import { memo } from "react";
import { Space, Button } from "antd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { AuditNode } from "@type/flow";
import styles from "./index.module.scss";

interface CounterSignButtonGroupProps {
  value?: NonNullable<AuditNode["countersign"]>["type"];
  onChange?(value: this["value"]): void;
}

function CounterSignButtonGroup(props: CounterSignButtonGroupProps) {
  const { value, onChange } = props;
  const handleTypeChange = useMemoCallback((value: CounterSignButtonGroupProps["value"]) => {
    if (!onChange) return;

    onChange(value);
  });

  return (
    <Space size={0} className={styles["btn-group"]}>
      <Button className={value === 1 ? styles.active : ""} onClick={() => handleTypeChange(1)} size="large">
        按百分比
      </Button>
      <Button className={value === 2 ? styles.active : ""} onClick={() => handleTypeChange(2)} size="large">
        按人数
      </Button>
    </Space>
  );
}

export default memo(CounterSignButtonGroup);
