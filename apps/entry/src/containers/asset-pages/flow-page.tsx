import { useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { loadMicroApp } from "qiankun";
import { FLOW_ENTRY } from "@/consts";
import { useWorkspaceDetailQuery } from "@/http";

const FlowMicroPage = ({ mode }: { mode: "preview" | "running" }) => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });
  const appId = useMemo(() => {
    if (workspaceId) {
      return +workspaceId;
    }
    return 0;
  }, [workspaceId]);

  const baseName = useMemo(() => {
    const modeMap = {
      preview: `/app-manager/${appId}/flow`,
      running: `/workspace/${appId}/flow`,
    };
    return modeMap[mode];
  }, [mode, appId]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const app = loadMicroApp({
        name: "easy-flow",
        entry: FLOW_ENTRY as string,
        container: containerRef.current,
        props: {
          basename: baseName || "",
          extra: {
            mode,
            theme,
          },
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
