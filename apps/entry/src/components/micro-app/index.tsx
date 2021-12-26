import { memo, useEffect, useRef, useState, useMemo } from "react";
import { loadMicroApp } from "qiankun";

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
  useEffect(() => {
    if (containerRef.current) {
      const app = loadMicroApp({
        name,
        entry: entry.replace(/\/$/, "") + `?ts=${Date.now()}`,
        container: containerRef.current,
        props: {
          basename: basename || "",
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
  }, [name, entry, basename, extra]);

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
}

export default memo(MicroApp);
