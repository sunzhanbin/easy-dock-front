import { memo, useState, useCallback, useEffect } from 'react';
import { Input } from 'antd';
import classnames from 'classnames';
import { Icon, Text } from '@common/components';
import styles from './index.module.scss';

interface EditProps {
  className?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultiText = ({ className, value, onChange }: EditProps) => {
  const [textList, setTextList] = useState<string[]>(value || []);
  const [text, setText] = useState<string>('');
  const handleAddText = useCallback(() => {
    if (text.trim()) {
      setTextList((list) => {
        const textList = [...list];
        textList.push(text);
        return textList;
      });
    }
    setText('');
  }, [text, setText]);

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
  }, [textList, onChange]);
  return (
    <div className={classnames(styles.muliText, className ? className : '')}>
      {textList.length > 0 && (
        <div className={styles.textContainer}>
          <div className={styles.textList}>
            {textList.map((text: string, index: number) => (
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
