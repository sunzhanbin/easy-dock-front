import { memo, ReactNode } from 'react';
import { Input, Checkbox } from 'antd';
import classnames from 'classnames';
import { ButtonAuth } from '@type/flow';
import styles from './index.module.scss';

interface ButtonEditorProps extends ButtonAuth {
  children: ReactNode;
  checkable?: boolean;
  className?: string;
  btnKey: string;
  value?: ButtonAuth;
  onChange?(value: this['value']): void;
}

function ButtonEditor(props: ButtonEditorProps) {
  const { value, children, onChange, checkable = true, className } = props;

  return (
    <div className={classnames(styles['btn-editor'], className)}>
      <div className={styles['btn-content']}>{children}</div>
      <Input
        className={styles['btn-alias']}
        value={value?.text}
        placeholder="请输入按钮别名"
        onChange={(event) => {
          if (onChange) {
            onChange({ text: event.target.value.trim(), enable: value?.enable || false });
          }
        }}
        size="large"
      />
      {checkable && (
        <Checkbox
          className={styles.choose}
          checked={value?.enable}
          disabled={!checkable}
          onChange={(event) => {
            if (onChange) {
              onChange({ text: value?.text || '', enable: event.target.checked });
            }
          }}
        />
      )}
    </div>
  );
}

export default memo(ButtonEditor);
