import { useCallback } from "react";
import { Menu } from "antd";
import { keyPath } from "@utils/utils";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import "@containers/app-setup-preview/single-nav.style";

const { SubMenu } = Menu;

const SingleNavComponent = ({
  children,
  extra,
  dataSource,
  selectedKey,
}: MenuComponentProps) => {
  const handleMenuClick = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^ \n\n", "color: #C80815; font-weight: bolder", {
      item,
      key,
      keyPath,
    });
  }, []);

  const handleMenuSelect = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^ \n\n", "color: #C80815; font-weight: bolder", {
      item,
      key,
      keyPath,
    });
  }, []);

  return (
    <div className="single-nav-component">
      <div className="sider">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu
            openKeys={keyPath(selectedKey, dataSource)}
            onClick={handleMenuClick}
            selectedKeys={[selectedKey]}
            onSelect={handleMenuSelect}
            mode="inline"
            style={{ width: 256 }}
          >
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
                    return <Menu.Item key={menu.id}>{menu.name}</Menu.Item>;
                  }
                });
              };
              return recurse(dataSource);
            })(dataSource)}
          </Menu>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default SingleNavComponent;
