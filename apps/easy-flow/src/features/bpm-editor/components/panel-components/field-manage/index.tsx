import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { memo } from 'react';
import styles from './index.module.scss';

interface ComProps {
  value?: any;
  onChange?: (value: this['value']) => void;
}

const FieldManage = (props: ComProps) => {
  const addItem = useMemoCallback(() => {
    console.info('add');
  });
  return (
    <div className={styles.fields}>
      <div className={styles.add_custom} onClick={addItem}>
        <Icon className={styles.iconfont} type="xinzengjiacu" />
        <span>添加字段</span>
      </div>
    </div>
  );
};
export default memo(FieldManage);
