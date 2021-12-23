import { memo, FC, useMemo, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { useAppSelector } from "@/store";
import {
  SubAppType,
  ThemeType,
  CANVAS_ENTRY,
  SPACE_ENTRY,
  CanvasResponseType,
} from "@/consts";
import {
  useGetCanvasIdMutation,
  useGetHoloSceneIdMutation,
  useWorkspaceDetailQuery,
} from "@/http/app-manager.hooks";
import { findItem } from "@/utils/utils";
import { Menu } from "@/utils/types";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { selectMenu } from "@/views/app-setup/menu-setup.slice";
import lightEmptyImage from "@assets/images/light-empty.png";
import darkEmptyImage from "@assets/images/dark-empty.png";
import FlowAppContent from "@/components/flow-app-content";

import "./app-content.style.scss";
import { selectCurrentWorkspaceId } from "@/views/app-manager/index.slice";

interface AppContentProps {
  selectedKey: string;
  theme: ThemeType;
}

type ThemeMap = {
  [k in ThemeType]: {
    imageUrl: string;
    className: string;
  };
};

const AppContent: FC<AppContentProps> = ({ selectedKey, theme }) => {
  const menuList = useAppSelector(selectMenu);
  const appId = useAppSelector(selectCurrentWorkspaceId);
  const { workspaceId } = useParams();
  const { data: workspace } = useWorkspaceDetailQuery(
    workspaceId ? +workspaceId : appId
  );
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const [canvasId, setCanvasId] = useState<string>("");
  const [holoSceneId, setHoloSceneId] = useState<string>("");
  const [holoSceneToken, setHoloSceneToken] = useState<string>("");
  const menu = useMemo<null | Menu>(() => {
    if (!menuList?.length) {
      return null;
    }
    return findItem(selectedKey, menuList);
  }, [selectedKey, menuList]);
  const isEmpty = useMemo<boolean>(() => {
    if (!menu?.form) {
      return true;
    }
    const { form } = menu;
    const { assetConfig, asset } = form;
    if (asset === "custom" && !assetConfig.url) {
      return true;
    }
    return asset === "exist" && !assetConfig.subAppId;
  }, [menu]);
  const themeMap = useMemo<ThemeMap>(() => {
    return {
      [ThemeType.LIGHT]: {
        imageUrl: lightEmptyImage,
        className: "light",
      },
      [ThemeType.DARK]: {
        imageUrl: darkEmptyImage,
        className: "dark",
      },
    };
  }, [theme]);
  const projectId = useMemo<number>(() => {
    if (workspace?.project?.id) {
      return workspace.project.id;
    }
    return 0;
  }, [workspace]);
  const empty = useMemo<ReactNode>(() => {
    const config = themeMap[theme];
    return (
      <div className={classNames("empty-container", config.className)}>
        <img src={config.imageUrl} alt="empty" className="image" />
        <div className="text">菜单暂无内容</div>
        <div className="tip">在右侧面板添加一个吧~</div>
      </div>
    );
  }, [isEmpty, themeMap]);
  // 是否是自定义url
  const isCustomUrl = useMemo<boolean>(() => {
    return !!(
      menu?.form &&
      menu.form.asset === "custom" &&
      menu.form.assetConfig?.url
    );
  }, [menu]);
  // 是否是已有资产
  const isExistAsset = useMemo<boolean>(() => {
    return !!(
      menu?.form &&
      menu.form.asset === "exist" &&
      menu.form.assetConfig?.subAppId
    );
  }, [menu]);
  const subAppType = useMemo<SubAppType | undefined>(() => {
    if (isExistAsset) {
      return menu?.form.assetConfig.subAppType;
    }
    return undefined;
  }, [menu, isExistAsset]);
  const subAppId = useMemo<string>(() => {
    if (isExistAsset) {
      return menu?.form.assetConfig?.subAppId || "";
    }
    return "";
  }, [menu, isExistAsset]);
  const renderIframe = useMemoCallback((url: string, className?: string) => {
    return (
      <iframe
        className={classNames("iframe-container", className && className)}
        src={url}
        frameBorder={0}
      />
    );
  });
  const renderContent = useMemoCallback(() => {
    if (isEmpty) {
      return empty;
    }
    if (isCustomUrl) {
      const url = menu!.form.assetConfig.url!;
      return renderIframe(url);
    }
    // 大屏子应用内容渲染
    if (subAppType === SubAppType.CANVAS && subAppId) {
      const url = `${CANVAS_ENTRY}/publish/${canvasId}?sso=true`;
      return renderIframe(url, "canvas-container");
    }
    // 空间子应用内容渲染
    if (subAppType === SubAppType.SPACE && subAppId) {
      const url = `${SPACE_ENTRY}/preview.html?token=${holoSceneToken}&id=${holoSceneId}`;
      return renderIframe(url, "space-container");
    }
    // 流程子应用内容渲染
    if (subAppType === SubAppType.FLOW && subAppId) {
      return (
        <FlowAppContent
          id={+subAppId}
          projectId={projectId}
          theme={themeMap[theme].className}
        />
      );
    }
    return empty;
  });

  useEffect(() => {
    (async () => {
      if (subAppType === SubAppType.CANVAS && subAppId) {
        const { data: canvasData } = (await getCanvasId(
          +subAppId
        )) as CanvasResponseType;
        canvasData?.refId && setCanvasId(canvasData.refId);
      }
      if (subAppType === SubAppType.SPACE && subAppId) {
        const { data: holoSceneData } = (await getHoloSceneId(
          +subAppId
        )) as CanvasResponseType;
        holoSceneData?.refId && setHoloSceneId(holoSceneData.refId);
        holoSceneData?.token && setHoloSceneToken(holoSceneData.token);
      }
    })();
  }, [subAppType, subAppId]);
  return <div className="app-content-container">{renderContent()}</div>;
};

export default memo(AppContent);
