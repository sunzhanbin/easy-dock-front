import { useCallback, useMemo, useEffect } from "react";
import { Menu } from "antd";
import { keyPath } from "@utils/utils";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import "@containers/app-setup-preview/multi-nav.style";

const { SubMenu } = Menu;

const MultiNavComponent = ({
  children,
  extra,
  dataSource,
  selectedKey,
}: MenuComponentProps) => {
  const submenu = useMemo(() => {
    const currentKey = keyPath(selectedKey, dataSource).shift() || selectedKey;
    const selectMenu = dataSource.find((item) => item.id === currentKey);
    return selectMenu?.children || [];
  }, [dataSource, selectedKey]);

  const activeMainKey = useMemo(
    () => keyPath(selectedKey, dataSource).shift() || selectedKey,
    [selectedKey, dataSource]
  );

  useEffect(() => {
    console.log(
      "%c^_^ \n\n",
      "color: #C80815; font-weight: bolder",
      JSON.stringify({ dataSource }, null, 2)
    );
  }, [dataSource]);

  const handleMainManu = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^ \n\n", "color: #C80815; font-weight: bolder", {
      item,
      key,
      keyPath,
    });
  }, []);

  return (
    <div className="multi-nav-component">
      <div className="header">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[activeMainKey]}
            onClick={handleMainManu}
          >
            {dataSource.map((menu) => (
              <Menu.Item key={menu.id}>{menu.name}</Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
      <div className="content">
        <div className="submenu">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={keyPath(selectedKey, submenu)}
          >
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
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default MultiNavComponent;
