import { memo, useCallback, useMemo } from "react";
import styles from "./index.module.scss";

const DescText = (props: { value: string; text_value?: string }) => {
  const { value, text_value } = props;
  const descValue = useMemo(() => {
    return value || text_value;
  }, [value, text_value]);
  const renderContent = useCallback(() => {
    if (!descValue || descValue.trim() === "<p></p>") {
      return <div className={styles.desc}>请补充描述性文字</div>;
    }
    return <div className={styles.content} dangerouslySetInnerHTML={{ __html: descValue }}></div>;
  }, [descValue]);
  return <div className={styles.container}>{renderContent()}</div>;
};

export default memo(DescText);
