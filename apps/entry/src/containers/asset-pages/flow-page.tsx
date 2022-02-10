import classNames from "classnames";
import { useParams } from "react-router";
import { MICRO_FLOW_ENTRY } from "@/consts";
import { useWorkspaceRuntimeDetailQuery } from "@/http";
import MicroApp from "@components/micro-app";
import "@containers/asset-pages/flow-page.style";

const FlowMicroPage = ({ mode }: { mode: "preview" | "running" }) => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });

  return (
    <div className={classNames("flow-page", theme)}>
      <MicroApp
        name="flow-page"
        entry={MICRO_FLOW_ENTRY!}
        basename={`/workspace/${workspaceId}/` || ""}
        extra={{ appId: workspaceId, mode: "running", theme }}
      ></MicroApp>
    </div>
  );
};

export default FlowMicroPage;
