import { useEffect, useRef, useState } from 'react';
import { loadMicroApp } from 'qiankun';
import Loading from '@components/loading';
import classnames from 'classnames';
import useMatchRoute from '@hooks/use-match-route';
import styles from './index.module.scss';

export default function Orch() {
  const orchRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const matchedRoute = useMatchRoute();

  useEffect(() => {
    if (orchRef.current) {
      const orch = loadMicroApp({
        name: 'orch',
        entry: 'http://localhost:3000/',
        container: orchRef.current,
        props: {
          basename: matchedRoute,
        },
      });

      orch.mountPromise.finally(() => {
        setLoading(false);
      });

      return () => {
        orch.unmount();
      };
    }
  }, [matchedRoute]);

  return (
    <div className={classnames(styles.orch)}>
      {loading && <Loading />}
      <div ref={orchRef}></div>
    </div>
  );
}
