import { memo, useMemo } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import MicroApp from '@components/micro-app';
import { envs } from '@consts';
import styles from './index.module.scss';

function DataManage() {
  const { url: basename } = useRouteMatch();
  const { appId } = useParams<{ appId: string }>();
  const extra = useMemo(() => ({ appId }), [appId]);
  return (
    <MicroApp
      className={styles.dataManage}
      entry={envs.EASY_FLOW_FRONTEND_ENTRY}
      name="easy-flow"
      basename={basename}
      extra={extra}
    />
  );
}

export default memo(DataManage);
