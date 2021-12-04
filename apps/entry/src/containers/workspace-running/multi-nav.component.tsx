import { useCallback, useState, useMemo } from "react";
import { Menu } from "antd";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { keyPath } from "@utils/utils";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import "@containers/workspace-running/multi-nav.style";

const { SubMenu } = Menu;

const MultiNavComponent = ({ extra, dataSource }: WorkspaceBaseMenuProps) => {
  const [activeMainKey, setActiveMainKey] = useState<string>();
  const submenu = useMemo(() => {
    const currentKey =
      keyPath(activeMainKey!, dataSource).shift() || activeMainKey;
    const selectMenu = dataSource.find((item) => item.id === currentKey);
    return selectMenu?.children || [];
  }, [dataSource, activeMainKey]);

  const handleMainManu = useCallback(({ key }) => {
    setActiveMainKey(key);
  }, []);

  return (
    <div className="multi-nav-component">
      <div className="header">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu theme="dark" mode="horizontal" onClick={handleMainManu}>
            {dataSource.map((menu) => (
              <Menu.Item key={menu.id}>
                <NavLink to={`${menu.id}`}>{menu.name}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
      <div className="content">
        <div className="submenu">
          <Menu mode="inline">
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
                    return (
                      <Menu.Item key={menu.id}>
                        <NavLink to={`${menu.id}`}>{menu.name}</NavLink>
                      </Menu.Item>
                    );
                  }
                });
              };
              return recurse(dataSource);
            })(submenu)}
          </Menu>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MultiNavComponent;
