import { memo } from "react";
import { useParams } from "react-router-dom";
import FlowAppContent from "@/components/flow-app-content";
import { useWorkspaceDetailQuery } from "@/http/app-manager.hooks";
import "./index.style.scss";

const FlowApp = () => {
  const { appId, subAppId } = useParams();
  const { theme, projectId } = useWorkspaceDetailQuery(Number(appId), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme,
      projectId: data?.project?.id,
    }),
    skip: !appId,
  });
  return <FlowAppContent id={+subAppId!} appId={appId!} projectId={projectId} theme={theme} />;
};

export default memo(FlowApp);
