import { useCallback } from "react";
import { Menu } from "antd";
import classNames from "classnames";
import { Outlet, useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { RouteMap, TASK_CENTER_TYPE } from "@utils/const";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import UserComponent from "@components//header/user";
import { setCurrentId } from "@/views/workspace/index.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { findFirstChild, findItem } from "@utils/utils";
import "@containers/workspace-running/single-nav.style";
import { CanvasResponseType, CANVAS_ENTRY, MAIN_ENTRY, SPACE_ENTRY, SubAppType } from "@/consts";
import { useGetCanvasIdMutation, useGetHoloSceneIdMutation } from "@/http/app-manager.hooks";
import { Icon } from "@common/components";

const { SubMenu } = Menu;

const SingleNavComponent = ({ extra, dataSource, theme, selectedKey }: WorkspaceBaseMenuProps) => {
  const { workspaceId: appId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [getCanvasId] = useGetCanvasIdMutation();
  const [getHoloSceneId] = useGetHoloSceneIdMutation();

  const renderIcon = useMemoCallback((icon) => {
    if (!icon || icon === "wukongjian") {
      return null;
    }
    return <Icon type={icon} />;
  });

  const navigateFn = useCallback(async (menu: IMenu) => {
    const {
      form: {
        assetConfig: { subAppType, subAppId, url: customUrl },
        mode,
      },
    } = menu;
    let url = "";
    // 当前窗口打开
    if (mode === "current") {
      // 流程类子应用
      if (subAppType === SubAppType.FLOW && subAppId) {
        url = `./${RouteMap[subAppType as unknown as keyof typeof RouteMap]}/instance/${subAppId}`;
      } else if (subAppId) {
        url = `./${RouteMap[subAppType as unknown as keyof typeof RouteMap]}`;
      } else if (customUrl) {
        url = "./iframe";
      } else {
        // 如果没有子应用id和自定义url,则显示空状态
        url = "./empty";
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
          const token = res?.data?.token;
          const id = res?.data?.refId;
          if (!token || !id) return;
          url = `${SPACE_ENTRY}/preview.html?token=${token}&id=${id}`;
        } else if (subAppType === SubAppType.FLOW) {
          if (!appId) {
            return;
          }
          url = `${MAIN_ENTRY}/main/app/${appId}/process/instance/${subAppId}?theme=${theme}&mode=running`;
        } else if (subAppType === TASK_CENTER_TYPE) {
          // url = `${FLOW_ENTRY}/task-center/${appId}?theme=${theme}&mode=running`;
          url = `${MAIN_ENTRY}/main/app/${appId}/process/task-center?theme=${theme}&mode=running&content=true`;
        } else {
          // 表单子应用和报表子应用暂时没有这两种场景,直接返回
          return;
        }
      } else if (customUrl) {
        url = customUrl;
      } else {
        url = `/app/${appId}/empty`;
      }
      window.open(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleClick = useMemoCallback(({ key }) => {
    const menu = dataSource.find((v) => v.id === key);
    if (menu) {
      const subMenu = findFirstChild(menu);
      if (subMenu.id !== selectedKey) {
        navigateFn(subMenu);
      }
      if (subMenu && subMenu.form?.mode === "current") {
        dispatch(setCurrentId(subMenu.id));
      }
    }
  });
  const handleSubMenuClick = useMemoCallback(({ key }) => {
    const menu = findItem(key, dataSource);
    if (selectedKey !== key) {
      navigateFn(menu);
    }

    if (menu && menu.form?.mode === "current") {
      dispatch(setCurrentId(key));
    }
  });

  return (
    <div className={classNames("single-nav-component", theme)}>
      <div className="left">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu mode="inline" style={{ width: 256 }} selectedKeys={[selectedKey]}>
            {/* @Todo 此处和菜单设置里的嵌套组件不同，antd 组件嵌套时，key 的数据丢失 */}
            {((dataSource) => {
              const recurse = (menus: IMenu[]) => {
                return menus.map((menu) => {
                  if (menu?.children?.length) {
                    return (
                      <SubMenu key={menu.id} title={menu.name} onTitleClick={handleTitleClick}>
                        {recurse(menu.children)}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item key={menu.id} icon={renderIcon(menu.form?.icon)} onClick={handleSubMenuClick}>
                        {menu.name}
                      </Menu.Item>
                    );
                  }
                });
              };
              return recurse(dataSource);
            })(dataSource)}
          </Menu>
        </div>
      </div>
      <div className="right">
        <div className="header">
          <div className="user-container">
            <UserComponent showProject={true} />
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SingleNavComponent;
