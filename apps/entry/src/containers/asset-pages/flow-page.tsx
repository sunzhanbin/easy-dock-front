import classNames from "classnames";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { loadMicroApp } from "qiankun";
import { MICRO_FLOW_ENTRY } from "@/consts";
import { useWorkspaceRuntimeDetailQuery } from "@/http";
import "@containers/asset-pages/flow-page.style";

const FlowMicroPage = ({ mode }: { mode: "preview" | "running" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });

  useEffect(() => {
    let microApp: any;
    if (containerRef.current) {
      microApp = loadMicroApp({
        name: "flow-page",
        entry: MICRO_FLOW_ENTRY!,
        container: containerRef.current,
        props: {
          basename: `/workspace/${workspaceId}/` || "",
          appId: workspaceId,
          mode: "running",
          theme,
        },
      });
    }
    return () => {
      microApp.unmount();
    };
  });

  return <div className={classNames("flow-page", theme)} ref={containerRef}></div>;
};

export default FlowMicroPage;
