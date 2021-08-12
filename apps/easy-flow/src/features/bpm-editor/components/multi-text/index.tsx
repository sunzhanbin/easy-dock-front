import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { Icon } from '@common/components';
import styles from './index.module.scss';

interface EditProps {
  className?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultiText = ({ className, value, onChange }: EditProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [textList, setTextList] = useState<string[]>(value || []);
  const [left, setLeft] = useState<number>(0);
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
  const handleDelete = useCallback(
    (index) => {
      const list = [...textList];
      list.splice(index, 1);
      setTextList(list);
    },
    [textList, setTextList],
  );
  useEffect(() => {
    onChange && onChange(textList);
    if (containerRef.current && listRef.current) {
      const containerWidth = parseInt(window.getComputedStyle(containerRef.current).width);
      const listWidth = parseInt(window.getComputedStyle(listRef.current).width);
      if (containerWidth >= listWidth) {
        setLeft(0);
      } else {
        setLeft(containerWidth - listWidth);
      }
    }
  }, [textList, containerRef, listRef, onChange, setLeft]);
  return (
    <div className={classnames(styles.muliText, className ? className : '')}>
      <div className={styles.textContainer} ref={containerRef}>
        <Tooltip placement="topRight" title={textList.join('、')}>
          <div className={styles.textList} ref={listRef} style={{ left: `${left}px` }}>
            {textList.map((text: string, index: number) => (
              <span className={styles.textWrapper} key={index}>
                <span className={styles.text}>{text}</span>
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
        </Tooltip>
      </div>
      <input type="text" placeholder="添加筛选值" className={styles.input} onBlur={handleBlur} onKeyUp={handleEnter} />
    </div>
  );
};

export default memo(MultiText);
