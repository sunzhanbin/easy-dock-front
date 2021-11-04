import { memo } from 'react';
import { Button, Form } from 'antd';
import { Icon } from '@common/components';
import { TriggerConfig } from '@/type/flow';
import styles from './index.module.scss';

export interface TriggerProps {
  name: string | string[];
  value?: TriggerConfig[];
  onChange?: (val: this['value']) => void;
}

const TriggerProcessConfig = (props: TriggerProps) => {
  const { name, value = [{}], onChange } = props;
  return <div className={styles.container}>
    
  </div>;
};

export default memo(TriggerProcessConfig);
