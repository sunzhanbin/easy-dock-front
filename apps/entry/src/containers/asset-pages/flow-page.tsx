import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import {
  selectAppId,
  selectProjectId,
  selectCurrentId,
} from "@views/workspace/index.slice";
import { useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import FlowAppContent from "@/components/flow-app-content";

import { findItem } from "@utils/utils";
// import microApp from "@micro-zoe/micro-app";

const FlowMicroPage = () => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const projectId = useAppSelector(selectProjectId);
  const { menu } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      menu: data?.extension?.meta?.menuList,
    }),
  });

  const appInfo = useMemo(() => {
    const menuInfo = findItem(selectedKey, menu);
    return {
      subAppId: menuInfo?.form?.assetConfig?.subAppId || 0,
      subAppType: menuInfo?.form?.assetConfig?.subAppType,
    };
  }, [selectedKey, menu]);

  console.log("流程应用", workspaceId);

  return (
    <div className="content-component">
      <FlowAppContent id={+appInfo.subAppId} projectId={+projectId} />
    </div>
  );
};

export default FlowMicroPage;
