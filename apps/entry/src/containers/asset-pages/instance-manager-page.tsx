import { useParams } from "react-router";
import { MICRO_FLOW_ENTRY } from "@/consts";
import { useWorkspaceRuntimeDetailQuery } from "@/http/app-manager.hooks";
import MicroApp from "@components/micro-app";
import "@containers/asset-pages/instance-manager-page.style";

const InstanceManagerMicroPage = () => {
  const { workspaceId } = useParams();

  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });

  return (
    <div className="instance-manager-page">
      <MicroApp
        name="instance-namager-page"
        entry={MICRO_FLOW_ENTRY!}
        basename={`/workspace/${workspaceId}/` || ""}
        extra={{ appId: workspaceId, mode: "running", theme }}
      ></MicroApp>
    </div>
  );
};

export default InstanceManagerMicroPage;
