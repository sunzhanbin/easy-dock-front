import { memo, useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

interface EditProps {
  className?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultiText = ({ className, value, onChange }: EditProps) => {
  const [textList, setTextList] = useState<string[]>(value || []);
  const handleBlur = useCallback((e) => {
    const text = e.target.value;
    if (text.trim()) {
      setTextList((list) => {
        const textList = [...list];
        textList.push(text);
        return textList;
      });
    }
    e.target.value = '';
  }, []);
  const handleEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        handleBlur(e);
      }
    },
    [handleBlur],
  );
  useEffect(() => {
    onChange && onChange(textList);
  }, [textList, onChange]);
  return (
    <div className={classnames(styles.muliText, className ? className : '')}>
      <div className={styles.textContainer}>
        {textList.map((text: string, index: number) => (
          <span className={styles.textWrapper} key={index}>
            <span className={styles.text}>{text}</span>
          </span>
        ))}
      </div>
      <input type="text" placeholder="添加筛选值" className={styles.input} onBlur={handleBlur} onKeyUp={handleEnter} />
    </div>
  );
};

export default memo(MultiText);
