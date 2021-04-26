import classnames from 'classnames';
import { useMemo } from 'react';
import styles from './index.module.scss';

export interface StateProps {
  state: 'success' | 'waiting' | 'editing';
  className?: string;
  children: React.ReactNode | string;
}
export default function State(props: StateProps) {
  const { state, className, children } = props;
  const stateClassName = useMemo(() => {
    if (state === 'success') {
      return styles.success;
    } else if (state === 'waiting') {
      return styles.waiting;
    } else {
      return styles.editing;
    }
  }, [state]);

  return <div className={classnames(styles.state, stateClassName, className)}>{children}</div>;
}
