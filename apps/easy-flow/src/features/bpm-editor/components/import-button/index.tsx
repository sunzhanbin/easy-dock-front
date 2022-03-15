import { memo, FC, useRef, useEffect } from "react";
import classNames from "classnames";
import { message } from "antd";
import styles from "./index.module.scss";
import { Icon } from "@common/components";

interface ImportButtonProps {
  text: string;
  className?: string;
  handleSuccess: (content: any) => void;
  handleBefore?: () => void;
}

const ImportButton: FC<ImportButtonProps> = ({ text, className, handleBefore, handleSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    const el = inputRef.current;
    if (!el) {
      return;
    }
    if (handleBefore) {
      handleBefore();
    }
    const event = new MouseEvent("click");
    el.dispatchEvent(event);
  };
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      const handleChange = () => {
        const file = el.files?.[0];
        if (file) {
          if (file.type !== "application/json") {
            message.error("文件类型错误,请上传json文件!");
          }
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e) => {
            const content = e.target?.result;
            try {
              const result = typeof content === "string" && JSON.parse(content);
              if (result) {
                handleSuccess(result);
              }
            } catch (error) {
              console.error(error);
            }
          };
        }
      };
      el.addEventListener("change", handleChange);
      return () => {
        el.removeEventListener("change", handleChange);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <div className={classNames(styles.import, className && className)} onClick={handleClick}>
        <Icon type="zhucexinjiekou" className={styles.icon} />
        <span className={styles.text}>{text}</span>
      </div>
      <input type="file" name="importFile" id="importFile" accept=".json" className={styles.file} ref={inputRef} />
    </div>
  );
};

export default memo(ImportButton);
