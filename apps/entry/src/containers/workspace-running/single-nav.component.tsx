import { useCallback } from "react";
import { Menu } from "antd";
import classNames from "classnames";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { RouteMap } from "@utils/const";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import UserComponent from "@components//header/user";
import { setCurrentId } from "@/views/workspace/index.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { findFirstChild, findItem } from "@utils/utils";
import "@containers/workspace-running/single-nav.style";

const { SubMenu } = Menu;

const SingleNavComponent = ({
  extra,
  dataSource,
  theme,
  selectedKey,
}: WorkspaceBaseMenuProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateFn = useCallback((menu: IMenu) => {
    const {
      form: {
        assetConfig: { subAppType },
      },
    } = menu;
    if (subAppType) {
      navigate(
        `./${RouteMap[(subAppType as unknown) as keyof typeof RouteMap]}`
      );
    } else {
      navigate(`./iframe`);
    }
  }, []);

  const handleTitleClick = useMemoCallback(({ key }) => {
    const menu = dataSource.find((v) => v.id === key);
    if (menu) {
      const subMenu = findFirstChild(menu);
      dispatch(setCurrentId(subMenu.id));
      navigateFn(subMenu);
    }
  });
  const handleSubMenuClick = useMemoCallback(({ _, key }) => {
    dispatch(setCurrentId(key));
    const menu = findItem(key, dataSource);
    navigateFn(menu);
  });

  return (
    <div className={classNames("single-nav-component", theme)}>
      <div className="left">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu
            mode="inline"
            style={{ width: 256 }}
            selectedKeys={[selectedKey]}
          >
            {/* @Todo 此处和菜单设置里的嵌套组件不同，antd 组件嵌套时，key 的数据丢失 */}
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
            })(dataSource)}
          </Menu>
        </div>
      </div>
      <div className="right">
        <div className="header">
          <div className="user-container">
            <UserComponent />
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
