import { memo, useEffect, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import MicroApp from '@components/micro-app';
import { RootState } from '@/store';
import { micros } from '@consts';
import styles from './index.module.scss';

function MicroPage() {
  const { path } = useRouteMatch();
  const { showHeader } = useSelector((state: RootState) => state.layout);
  const currentInfo = useMemo(() => {
    return micros.find((micro) => micro.route === path)!;
  }, [path]);

  useEffect(() => {
    const title = document.title;

    document.title = currentInfo.title;

    return () => {
      document.title = title;
    };
  }, [currentInfo]);

  return (
    <MicroApp
      className={classnames(styles.micro, { [styles['has-header']]: showHeader })}
      name={currentInfo.name}
      entry={currentInfo.entry}
    />
  );
}

export default memo(MicroPage);
