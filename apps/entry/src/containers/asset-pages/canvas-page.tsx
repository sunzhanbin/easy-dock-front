import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import { useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import { findItem } from "@utils/utils";

const CanvasMicroPage = () => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const { menu } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      menu: data?.extension?.meta?.menuList,
    }),
  });
  const appInfo = useMemo(() => {
    const menuInfo = findItem(selectedKey, menu);
    return {
      subAppId: menuInfo?.form?.assetConfig?.subAppId,
      subAppType: menuInfo?.form?.assetConfig?.subAppType,
    };
  }, [selectedKey, menu]);

  useEffect(() => {
    console.log("appInfo", appInfo);
  }, [appInfo]);

  return (
    <div className="canvas-page">
      <iframe className="iframe" src={""} frameBorder={0}></iframe>
    </div>
  );
};

export default CanvasMicroPage;
