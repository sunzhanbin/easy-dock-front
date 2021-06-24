import { memo, useEffect, useRef, useState } from 'react';
import { loadMicroApp } from 'qiankun';
import Loading from '@components/loading';
import classnames from 'classnames';
import useMatchRoute from '@hooks/use-match-route';
import styles from './index.module.scss';

interface MicroAppProps {
  name: string;
  entry: string;
  className?: string;
  basename?: string;
  extra?: any;
}

function MicroApp(props: MicroAppProps) {
  const { name, entry, className, basename, extra } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const matchedRoute = useMatchRoute();

  useEffect(() => {
    if (containerRef.current) {
      const app = loadMicroApp({
        name,
        entry,
        container: containerRef.current,
        props: {
          basename: basename || matchedRoute,
          ...extra,
        },
      });

      app.mountPromise.finally(() => {
        // 防止页面跳走后才加载成功时setstate的警告;
        if (containerRef.current) {
          setLoading(false);
        }
      });

      return () => {
        app.unmount();
      };
    }
  }, [name, entry, basename, matchedRoute, extra]);

  return (
    <div className={classnames(styles.container, className)}>
      {loading && <Loading />}
      <div className={styles.content} ref={containerRef}></div>
    </div>
  );
}

export default memo(MicroApp);
