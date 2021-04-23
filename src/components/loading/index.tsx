import { Spin } from 'antd';
import { SpinSize } from 'antd/lib/spin';
import styles from './index.module.scss';

interface LoadingProps {
  size?: SpinSize;
}

export default function Loading(props: LoadingProps) {
  const { size } = props;

  return <Spin className={styles.loading} size={size} spinning />;
}
