import { useEffect, useRef, useState } from 'react';
import { loadMicroApp } from 'qiankun';

import Auth from '@enc/sso';

import Loading from '@components/loading';

import classnames from 'classnames';
import useMatchRoute from '@hooks/use-match-route';
import { envs } from '@consts';
import styles from './index.module.scss';

export default function Orch() {
  const orchRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const matchedRoute = useMatchRoute();

  useEffect(() => {
    if (!orchRef.current) return;

    const token = Auth.getAuth();

    const orch = loadMicroApp(
      {
        name: 'orch',
        entry: envs.ALGOR_ORCH_FRONTEND_ENTRY,
        container: orchRef.current,
        props: {
          basename: matchedRoute,
          token,
        },
      },
      {
        sandbox: {
          // 严格隔离样式会导致icon失效, 暂时关闭, TODO: 优化
          // 2021/11/18 weilaib: 已有解决方案，可以设置为 true
          strictStyleIsolation: false,
        },
      },
    );

    orch.mountPromise
      .catch((e) => {
        console.error('loadMicroApp envs.ALGOR_ORCH_FRONTEND_ENTRY error:', e);
      })
      .finally(() => {
        // 防止页面跳走后才加载成功时setstate的警告;
        if (orchRef.current) {
          setLoading(false);
        }
      });

    return () => {
      orch.unmount();
    };
  }, [matchedRoute]);

  return (
    <div className={classnames(styles.orch)}>
      {loading && <Loading />}
      <div ref={orchRef}></div>
    </div>
  );
}
