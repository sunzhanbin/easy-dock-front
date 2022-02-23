import { memo, useState, useCallback } from "react";
import { Input } from "antd";
import classnames from "classnames";
import { Icon, Text } from "@common/components";
import styles from "./index.module.scss";

interface EditProps {
  className?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultiText = ({ className, value, onChange }: EditProps) => {
  const [text, setText] = useState<string>("");
  const handleAddText = useCallback(() => {
    if (text.trim()) {
      const list = value ? [...value] : [];
      list.push(text);
      onChange && onChange(list);
    }
    setText("");
  }, [text, value, onChange]);

  const handleDelete = useCallback(
    (index) => {
      const list = value ? [...value] : [];
      list.splice(index, 1);
      onChange && onChange(list);
    },
    [value, onChange],
  );
  return (
    <div className={classnames(styles.muliText, className ? className : "")}>
      {value && value.length > 0 && (
        <div className={styles.textContainer}>
          <div className={styles.textList}>
            {value.map((text: string, index: number) => (
              <span className={styles.textWrapper} key={index}>
                <Text text={text} getContainer={false}>
                  <span tabIndex={index} className={classnames(styles.text)}>
                    {text}
                  </span>
                </Text>
                <span
                  className={styles.delete}
                  onClick={() => {
                    handleDelete(index);
                  }}
                >
                  <Icon type="guanbi" />
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Input
        placeholder="添加筛选值"
        bordered={false}
        size="large"
        className={styles.input}
        value={text}
        suffix={
          <div className={styles.ok} onClick={handleAddText}>
            <Icon type="gou" />
          </div>
        }
        onChange={(e) => {
          setText(e.target.value);
        }}
        onPressEnter={handleAddText}
      />
    </div>
  );
};

export default memo(MultiText);
