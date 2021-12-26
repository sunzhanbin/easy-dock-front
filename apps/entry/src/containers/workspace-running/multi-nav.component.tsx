import { useCallback, useState, useMemo } from "react";
import { Menu } from "antd";
import { Icon } from "@common/components";
import classNames from "classnames";
import { useAppDispatch } from "@/store";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { setCurrentId } from "@/views/workspace/index.slice";
import { keyPath, findFirstChild } from "@utils/utils";
import { RouteMap } from "@utils/const";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import UserComponent from "@components//header/user";
import { SubAppType } from "@/consts/type";

import "@containers/workspace-running/multi-nav.style";

const { SubMenu } = Menu;

const MultiNavComponent = ({
  extra,
  dataSource,
  theme,
  selectedKey,
}: WorkspaceBaseMenuProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeMainKey, setActiveMainKey] = useState<string>();
  const submenu = useMemo(() => {
    const currentKey =
      keyPath(activeMainKey!, dataSource).shift() || activeMainKey;
    const selectMenu = dataSource.find((item) => item.id === currentKey);
    return selectMenu?.children || [];
  }, [dataSource, activeMainKey]);

  const handleMainManu = useCallback(({ key }) => {
    setActiveMainKey(key);

    const menu = dataSource.find((v) => v.id === key) || {};
    const subMenu = findFirstChild(menu as IMenu);
    dispatch(setCurrentId(subMenu.id));
    const {
      form: {
        assetConfig: { subAppType, subAppId },
      },
    } = subMenu;
    console.info(subMenu, "888");
    if (subAppType === SubAppType.FLOW && subAppId) {
      navigate(
        `./${
          RouteMap[(subAppType as unknown) as keyof typeof RouteMap]
        }/instance/${subAppId}`
      );
    } else if (subAppId) {
      navigate(
        `./${RouteMap[(subAppType as unknown) as keyof typeof RouteMap]}`
      );
    } else {
      navigate(`./iframe`);
    }
  }, []);

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
          <Menu mode="horizontal" onClick={handleMainManu}>
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
                        <SubMenu key={menu.id} title={menu.name}>
                          {recurse(menu.children)}
                        </SubMenu>
                      );
                    } else {
                      return <Menu.Item key={menu.id}>{menu.name}</Menu.Item>;
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
