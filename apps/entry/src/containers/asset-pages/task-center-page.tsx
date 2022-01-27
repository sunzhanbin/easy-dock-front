import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { loadMicroApp } from "qiankun";
import { MICRO_FLOW_ENTRY } from "@/consts";
import { useWorkspaceRuntimeDetailQuery } from "@/http/app-manager.hooks";
import "@containers/asset-pages/task-center-page.style";

const TaskCenterMicroPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });

  useEffect(() => {
    if (containerRef.current) {
      const microApp = loadMicroApp({
        name: "task-center-page",
        entry: MICRO_FLOW_ENTRY!,
        container: containerRef.current,
        props: {
          basename: `/workspace/${workspaceId}/` || "",
          appId: workspaceId,
          mode: "running",
          theme,
        },
      });
      return () => {
        microApp.unmount();
      };
    }
  });

  return <div className="task-center-page" ref={containerRef}></div>;
};

export default TaskCenterMicroPage;
