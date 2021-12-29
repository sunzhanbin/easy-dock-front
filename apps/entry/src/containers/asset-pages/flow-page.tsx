import { useMemo } from "react";
import { useParams } from "react-router";
import { MAIN_ENTRY } from "@/consts";
import { useWorkspaceDetailQuery } from "@/http";
import { useAppSelector } from "@/store";
import { selectCurrentId } from "@views/workspace/index.slice";
import { findItem } from "@utils/utils";
import "@containers/asset-pages/flow-page.style";

const FlowMicroPage = ({ mode }: { mode: "preview" | "running" }) => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const { theme, menu } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
      menu: data?.extension?.meta?.menuList,
    }),
  });
  const appId = useMemo(() => {
    if (workspaceId) {
      return +workspaceId;
    }
    return 0;
  }, [workspaceId]);

  const appInfo = useMemo(() => {
    const menuInfo = findItem(selectedKey, menu);
    return {
      subAppId: menuInfo?.form?.assetConfig?.subAppId || 0,
      subAppType: menuInfo?.form?.assetConfig?.subAppType,
    };
  }, [selectedKey, menu]);

  return (
    <div className="flow-page">
      <iframe
        className="iframe"
        src={`${MAIN_ENTRY}/main/app/${workspaceId || appId}/process/instance/${
          appInfo?.subAppId
        }?theme=${theme}&mode=running`}
        frameBorder={0}
      />
    </div>
  );
};

export default FlowMicroPage;
