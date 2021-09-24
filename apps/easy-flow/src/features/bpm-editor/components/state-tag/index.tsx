import { memo, FC, useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

const stateMap: { [k: number]: { className: string; text: string } } = {
  1: {
    className: 'doing',
    text: '进行中',
  },
  2: {
    className: 'stop',
    text: '已终止',
  },
  3: {
    className: 'recall',
    text: '已撤回',
  },
  4: {
    className: 'done',
    text: '已办结',
  },
  5: {
    className: 'reject',
    text: '已驳回',
  },
};

const StateTag: FC<{ state: number }> = ({ state }) => {
  const status = useMemo(() => {
    return stateMap[state];
  }, [state]);
  return <div className={classNames(styles.status, styles[status.className])}>{status.text}</div>;
};

export default memo(StateTag);
