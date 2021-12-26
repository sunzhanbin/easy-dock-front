import { useCallback, useState, useMemo } from "react";
import { Menu } from "antd";
import { Icon } from "@common/components";
import classNames from "classnames";
import { useAppDispatch } from "@/store";
import { Outlet, useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { setCurrentId } from "@/views/workspace/index.slice";
import { keyPath, findFirstChild, findItem } from "@utils/utils";
import { RouteMap } from "@utils/const";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import UserComponent from "@components//header/user";
import "@containers/workspace-running/multi-nav.style";
import {
  CanvasResponseType,
  CANVAS_ENTRY,
  SPACE_ENTRY,
  SubAppType,
} from "@/consts";
import {
  useGetCanvasIdMutation,
  useGetHoloSceneIdMutation,
} from "@/http/app-manager.hooks";

const { SubMenu } = Menu;

const MultiNavComponent = ({
  extra,
  dataSource,
  theme,
  selectedKey,
}: WorkspaceBaseMenuProps) => {
  const { workspaceId: appId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [getCanvasId] = useGetCanvasIdMutation();
  const [getHoloSceneId] = useGetHoloSceneIdMutation();

  const [activeMainKey, setActiveMainKey] = useState<string>();
  const submenu = useMemo(() => {
    const currentKey =
      keyPath(activeMainKey!, dataSource).shift() || activeMainKey;
    const selectMenu = dataSource.find((item) => item.id === currentKey);
    return selectMenu?.children || [];
  }, [dataSource, activeMainKey]);

  const navigateFn = useMemoCallback(async (menu: IMenu) => {
    const {
      form: {
        assetConfig: { subAppType, subAppId, url: customUrl },
        mode,
      },
    } = menu;
    let url = "";
    if (mode === "current") {
      // 当前窗口打开
      if (subAppType === SubAppType.FLOW && subAppId) {
        url = `./${
          RouteMap[(subAppType as unknown) as keyof typeof RouteMap]
        }/instance/${subAppId}`;
      } else if (subAppId) {
        url = `./${RouteMap[(subAppType as unknown) as keyof typeof RouteMap]}`;
      } else {
        url = "./iframe";
      }
      navigate(url);
    } else {
      // 新窗口打开
      if (subAppType && subAppId) {
        if (subAppType === SubAppType.CANVAS) {
          const res = (await getCanvasId(+subAppId)) as CanvasResponseType;
          const canvasId = res.data.refId;
          url = `${CANVAS_ENTRY}/publish/${canvasId}`;
        } else if (subAppType === SubAppType.SPACE) {
          const res = (await getHoloSceneId(+subAppId)) as CanvasResponseType;
          const token = res.data.token!;
          const id = res.data.refId;
          url = `${SPACE_ENTRY}/preview.html?token=${token}&id=${id}`;
        } else if (subAppType === SubAppType.FLOW) {
          const origin = window.location.origin;
          if (!appId) {
            return;
          }
          url = `${origin}/app/${appId}/flow-app/${subAppId}`;
        } else {
          // 表单子应用和报表子应用暂时没有这两种场景,直接返回
          return;
        }
      } else {
        url = customUrl!;
      }
      window.open(url);
    }
  });

  const handleMainMenuClick = useMemoCallback(({ key }) => {
    setActiveMainKey(key);

    const menu = dataSource.find((v) => v.id === key) || {};
    const subMenu = findFirstChild(menu as IMenu);
    navigateFn(subMenu);
    if (subMenu && subMenu.form?.mode === "current") {
      dispatch(setCurrentId(subMenu.id));
    }
  });

  const handleTitleClick = useMemoCallback(({ key }) => {
    const menu = findItem(key, dataSource);
    navigateFn(menu);
    if (menu && menu.form?.mode === "current") {
      dispatch(setCurrentId(key));
    }
  });
  const handleSubMenuClick = useMemoCallback(({ _, key }) => {
    const menu = findItem(key, dataSource);
    navigateFn(menu);
    if (menu && menu.form?.mode === "current") {
      dispatch(setCurrentId(key));
    }
  });

  const renderIcon = useMemoCallback((icon) => {
    if (!icon || icon === "wukongjian") {
      return null;
    }
    return <Icon type={icon} />;
  });

  return (
    <div className={classNames("multi-nav-component", theme)}>
      <div className="header">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu mode="horizontal" onClick={handleMainMenuClick}>
            {dataSource.map((menu) => (
              <Menu.Item key={menu.id} icon={renderIcon(menu?.form?.icon)}>
                {menu.name}
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div className="user-container">
          <UserComponent />
        </div>
      </div>
      <div className="content">
        {!!submenu?.length && (
          <div className="submenu">
            <Menu mode="inline" selectedKeys={[selectedKey]}>
              {((dataSource) => {
                const recurse = (menus: IMenu[]) => {
                  return menus.map((menu) => {
                    if (menu?.children?.length) {
                      return (
                        <SubMenu
                          key={menu.id}
                          title={menu.name}
                          onTitleClick={handleTitleClick}
                        >
                          {recurse(menu.children)}
                        </SubMenu>
                      );
                    } else {
                      return (
                        <Menu.Item key={menu.id} onClick={handleSubMenuClick}>
                          {menu.name}
                        </Menu.Item>
                      );
                    }
                  });
                };
                return recurse(dataSource);
              })(submenu)}
            </Menu>
          </div>
        )}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MultiNavComponent;
