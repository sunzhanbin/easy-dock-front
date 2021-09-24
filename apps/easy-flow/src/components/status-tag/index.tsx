import { memo, ReactNode } from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface StatusTagProps {
  status: 'success' | 'primary' | 'error' | 'warning' | 'revoke';
  children?: ReactNode;
}

function StatusTag(props: StatusTagProps) {
  const { children, status } = props;

  return <span className={classnames(styles.tag, styles[status])}>{children}</span>;
}

export default memo(StatusTag);
