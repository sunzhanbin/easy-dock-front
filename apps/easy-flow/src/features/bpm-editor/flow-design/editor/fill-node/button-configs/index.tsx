import { memo } from 'react';
import { Button } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import ButtonEditor from '../../components/button-editor';
import { FillNode, AllNode, ButtonAuth } from '../../../types';
import styles from './index.module.scss';

interface ButtonConfigsProps {
  value?: FillNode['btnText'];
  prevNodes: AllNode[];
  onChange?(value: this['value']): void;
}

function ButtonConfigs(props: ButtonConfigsProps) {
  const { value, onChange } = props;
  const handleButtonChange = useMemoCallback((key: string, config: ButtonAuth) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { [key]: config }));
  });

  return (
    <div className={styles['btn-configs']}>
      <ButtonEditor
        className={styles.editor}
        text={value?.save?.text}
        enable={value?.save?.enable}
        btnKey="save"
        onChange={handleButtonChange}
      >
        <Button size="large">保存</Button>
      </ButtonEditor>

      <ButtonEditor
        className={styles.editor}
        text={value?.submit?.text}
        enable={value?.submit?.enable}
        btnKey="submit"
        onChange={handleButtonChange}
      >
        <Button size="large">同意</Button>
      </ButtonEditor>
    </div>
  );
}

export default memo(ButtonConfigs);
