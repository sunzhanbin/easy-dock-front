import { useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { loadMicroApp } from "qiankun";

const FlowMicroPage = () => {
  const { workspaceId } = useParams();

  const appId = useMemo(() => {
    if (workspaceId) {
      return +workspaceId;
    }
    return 0;
  }, [workspaceId]);

  console.log("流程应用", workspaceId);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const app = loadMicroApp({
        name: "easy-flow",
        entry: "http://localhost:8083",
        container: containerRef.current,
        props: {
          basename: `/workspace/${appId}/flow` || "",
        },
      });

      // app.mountPromise.finally(() => {
      //   // 防止页面跳走后才加载成功时setstate的警告;
      //   if (containerRef.current) {
      //     setLoading(false);
      //   }
      // });

      return () => {
        app.unmount();
      };
    }
  }, []);

  return <div className="flow-page" ref={containerRef}></div>;
};

export default FlowMicroPage;
