import { useParams } from "react-router";
import { MICRO_FLOW_ENTRY } from "@/consts";
import { useWorkspaceRuntimeDetailQuery } from "@/http/app-manager.hooks";
import MicroApp from "@components/micro-app";
import "@containers/asset-pages/task-center-page.style";

const TaskCenterMicroPage = () => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });

  return (
    <div className="task-center-page">
      <MicroApp
        name="task-center-page"
        entry={MICRO_FLOW_ENTRY!}
        basename={`/workspace/${workspaceId}/` || ""}
        extra={{ appId: workspaceId, mode: "running", theme }}
      ></MicroApp>
    </div>
  );
};

export default TaskCenterMicroPage;
