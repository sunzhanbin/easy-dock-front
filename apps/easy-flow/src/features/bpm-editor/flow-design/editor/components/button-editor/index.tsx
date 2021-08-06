import { memo, ReactNode } from 'react';
import { Input, Checkbox } from 'antd';
import classnames from 'classnames';
import { ButtonAuth } from '@type/flow';
import styles from './index.module.scss';

interface ButtonEditorProps extends ButtonAuth {
  onChange(btnKey: this['btnKey'], config: ButtonAuth): void;
  children: ReactNode;
  checkable?: boolean;
  className?: string;
  btnKey: string;
}

function ButtonEditor(props: ButtonEditorProps) {
  const { text, enable, children, onChange, checkable = true, btnKey, className } = props;

  return (
    <div className={classnames(styles['btn-editor'], className)}>
      <div className={styles['btn-content']}>{children}</div>
      <Input
        className={styles['btn-alias']}
        value={text}
        placeholder="请输入按钮别名"
        onChange={(event) => {
          onChange(btnKey, { text: event.target.value.trim(), enable: enable || false });
        }}
        size="large"
      />
      {checkable && (
        <Checkbox
          className={styles.choose}
          checked={enable}
          disabled={!checkable}
          onChange={(event) => {
            onChange(btnKey, { text, enable: event.target.checked });
          }}
        />
      )}
    </div>
  );
}

export default memo(ButtonEditor);
