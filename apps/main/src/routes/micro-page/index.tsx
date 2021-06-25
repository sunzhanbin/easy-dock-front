import { memo, useEffect, useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import classnames from 'classnames';
import MicroApp from '@components/micro-app';
import { micros } from '@consts';
import styles from './index.module.scss';

function MicroPage({ hasHeader }: { hasHeader?: boolean }) {
  const { path } = useRouteMatch();
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
      className={classnames(styles.micro, { [styles['has-header']]: hasHeader })}
      name={currentInfo.name}
      entry={currentInfo.entry}
    />
  );
}

export default memo(MicroPage);
