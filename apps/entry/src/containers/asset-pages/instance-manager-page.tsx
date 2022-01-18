import { useMemo } from "react";
import { useParams } from "react-router";
import { MAIN_ENTRY } from "@/consts";
import { useWorkspaceDetailQuery } from "@/http/app-manager.hooks";
import "@containers/asset-pages/instance-manager-page.style";

const InstanceManagerMicroPage = () => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
  });
  const url = useMemo(() => {
    return `${MAIN_ENTRY}/main/instance/${workspaceId}/data-manage?theme=${theme}&mode=running`;
  }, [theme]);

  return (
    <div className="instance-manager-page">
      <iframe className="iframe" src={url} frameBorder={0} />
    </div>
  );
};

export default InstanceManagerMicroPage;
