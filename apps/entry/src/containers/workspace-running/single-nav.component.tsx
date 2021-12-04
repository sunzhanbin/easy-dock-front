import { Menu } from "antd";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { WorkspaceBaseMenuProps, Menu as IMenu } from "@utils/types";
import "@containers/workspace-running/single-nav.style";

const { SubMenu } = Menu;

const SingleNavComponent = ({ extra, dataSource }: WorkspaceBaseMenuProps) => {
  return (
    <div className="single-nav-component">
      <div className="sider">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu mode="inline" style={{ width: 256 }}>
            {/* @Todo 此处和菜单设置里的嵌套组件不同，antd 组件嵌套时，key 的数据丢失 */}
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
            })(dataSource)}
          </Menu>
        </div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default SingleNavComponent;
