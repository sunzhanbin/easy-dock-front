import { memo, FC, useMemo, useEffect, useState, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import { useAppSelector } from '@/store';
import { SubAppType, ThemeType, CANVAS_ENTRY, SPACE_ENTRY, CanvasResponseType, MAIN_ENTRY } from '@/consts';
import { useGetCanvasIdMutation, useGetHoloSceneIdMutation } from '@/http/app-manager.hooks';
import { findItem } from '@/utils/utils';
import { Menu } from '@/utils/types';
import { TASK_CENTER_TYPE, INSTANCE_MANAGER_TYPE } from '@utils/const';
import useMemoCallback from '@common/hooks/use-memo-callback';
import lightEmptyImage from '@assets/images/light-empty.png';
import darkEmptyImage from '@assets/images/dark-empty.png';
import { selectMenu } from '@/views/app-setup/menu-setup.slice';
import { selectCurrentWorkspaceId } from '@/views/app-manager/index.slice';
import './app-content.style.scss';

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
  // 应用管理页面的路由中没有携带workspaceId,故从redux中取
  const currentWorkspaceId = useAppSelector(selectCurrentWorkspaceId);
  const { workspaceId } = useParams();
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const [canvasId, setCanvasId] = useState<string>('');
  const [holoSceneId, setHoloSceneId] = useState<string>('');
  const [holoSceneToken, setHoloSceneToken] = useState<string>('');
  const menu = useMemo<null | Menu>(() => {
    if (!menuList?.length) {
      return null;
    }
    return findItem(selectedKey, menuList);
  }, [selectedKey, menuList]);
  const appId = useMemo(() => workspaceId || currentWorkspaceId, [workspaceId, currentWorkspaceId]);
  const isEmpty = useMemo<boolean>(() => {
    if (!menu?.form) {
      return true;
    }
    const { form } = menu;
    const { assetConfig, asset } = form;
    if (asset === 'custom' && !assetConfig.url) {
      return true;
    }
    return asset === 'exist' && !assetConfig.subAppId;
  }, [menu]);
  const themeMap = useMemo<ThemeMap>(() => {
    return {
      [ThemeType.LIGHT]: {
        imageUrl: lightEmptyImage,
        className: 'light',
      },
      [ThemeType.DARK]: {
        imageUrl: darkEmptyImage,
        className: 'dark',
      },
      [ThemeType.ORANGE]: {
        imageUrl: darkEmptyImage,
        className: 'orange',
      },
      [ThemeType.BLUE]: {
        imageUrl: darkEmptyImage,
        className: 'blue',
      },
    };
  }, [theme]);
  const empty = useMemo<ReactNode>(() => {
    const config = themeMap[theme] || themeMap[ThemeType.LIGHT];
    return (
      <div className={classNames('empty-container', config.className)}>
        <img src={config.imageUrl} alt="empty" className="image" />
        <div className="text">菜单暂无内容</div>
        <div className="tip">在右侧面板添加一个吧~</div>
      </div>
    );
  }, [isEmpty, themeMap, theme]);
  // 是否是自定义url
  const isCustomUrl = useMemo<boolean>(() => {
    return !!(menu?.form && menu.form.asset === 'custom' && menu.form.assetConfig?.url);
  }, [menu]);
  // 是否是已有资产
  const isExistAsset = useMemo<boolean>(() => {
    return !!(menu?.form && menu.form.asset === 'exist' && menu.form.assetConfig?.subAppId);
  }, [menu]);
  const subAppType = useMemo(() => {
    if (isExistAsset) {
      return menu?.form.assetConfig.subAppType;
    }
    return undefined;
  }, [menu, isExistAsset]);
  const subAppId = useMemo<string | undefined>(() => {
    if (isExistAsset) {
      return menu?.form.assetConfig?.subAppId || undefined;
    }
    return undefined;
  }, [menu, isExistAsset]);
  const renderIframe = useMemoCallback((url: string, className?: string) => {
    return <iframe className={classNames('iframe-container', className && className)} src={url} frameBorder={0} />;
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
      const url = `${CANVAS_ENTRY}/publish/${canvasId}`;
      return renderIframe(url, 'canvas-container');
    }
    // 空间子应用内容渲染
    if (subAppType === SubAppType.SPACE && subAppId) {
      const url = `${SPACE_ENTRY}/preview.html?token=${holoSceneToken}&id=${holoSceneId}`;
      return renderIframe(url, 'space-container');
    }
    // 流程子应用内容渲染
    if (subAppType === SubAppType.FLOW && subAppId) {
      const url = `${MAIN_ENTRY}/main/app/${appId}/process/instance/${subAppId}?theme=${theme}&mode=preview`;
      return renderIframe(url, 'flow-container');
    }
    // 任务中心内容渲染
    if (subAppType === TASK_CENTER_TYPE && subAppId) {
      const url = `${MAIN_ENTRY}/main/instance/${workspaceId}/task-center?theme=${theme}&mode=preview`;
      return renderIframe(url, 'space-container');
    }

    // 流程数据管理
    if (subAppType === INSTANCE_MANAGER_TYPE) {
      const url = `${MAIN_ENTRY}/main/instance/${appId}/data-manage?theme=${theme}&mode=preview`;
      return renderIframe(url, 'flow-manager-container');
    }
    return empty;
  });

  useEffect(() => {
    (async () => {
      if (subAppType === SubAppType.CANVAS && subAppId) {
        const { data: canvasData } = (await getCanvasId(+subAppId)) as CanvasResponseType;
        canvasData?.refId && setCanvasId(canvasData.refId);
      }
      if (subAppType === SubAppType.SPACE && subAppId) {
        const { data: holoSceneData } = (await getHoloSceneId(+subAppId)) as CanvasResponseType;
        holoSceneData?.refId && setHoloSceneId(holoSceneData.refId);
        holoSceneData?.token && setHoloSceneToken(holoSceneData.token);
      }
    })();
  }, [subAppType, subAppId]);

  return <div className="app-content-container">{renderContent()}</div>;
};

export default memo(AppContent);
