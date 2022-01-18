import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import { useGetCanvasIdMutation, useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import { findItem } from "@utils/utils";
import { CANVAS_ENTRY } from "@/consts";

import "./canvas-page.style.scss";

const CanvasMicroPage = () => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const [getCanvasId] = useGetCanvasIdMutation();
  const [src, setSrc] = useState<string>("");
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
    if (appInfo?.subAppId) {
      const { subAppId } = appInfo;
      getCanvasId(+subAppId).then((res) => {
        const canvasId = (res as { data: any }).data?.refId;
        const src = `${CANVAS_ENTRY}/publish/${canvasId}`;
        setSrc(src);
      });
    }
  }, [appInfo?.subAppId]);

  return (
    <div className="canvas-page">
      <iframe className="iframe" src={src} frameBorder={0}></iframe>
    </div>
  );
};

export default CanvasMicroPage;
