import { memo, useEffect, useRef, useState } from "react";
import { loadMicroApp } from "qiankun";

interface MicroAppProps {
  name: string;
  entry: string;
  className?: string;
  basename?: string;
  extra?: any;
}

function MicroApp(props: MicroAppProps) {
  const { name, entry, basename, extra } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLoading] = useState(true);
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
