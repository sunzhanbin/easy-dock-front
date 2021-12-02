import { useCallback, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import { selectTheme, selectNavMode } from "@views/app-setup/basic-setup.slice";
import { selectMenu, selectCurrentId } from "@views/app-setup/menu-setup.slice";
import { keyPath } from "@utils/utils";
import "./index.style";

import { Menu } from "antd";

const { SubMenu } = Menu;

const SingleNavComponent = ({
  children,
  extra,
  dataSource,
  selectedKey,
}: any) => {
  const handleMenuClick = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^", "color: #C80815", { item, key, keyPath });
  }, []);

  const handleMenuSelect = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^ menuSelect", "color: #C80815", { item, key, keyPath });
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
              const recurse = (menus: any) => {
                return menus.map((menu: any) => {
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

const MultiNavComponent = ({ children, extra }: any) => {
  return (
    <div className="multi-nav-component">
      <div className="header">
        <div className="extra">{extra}</div>
        <div className="menu">这里是主菜单</div>
      </div>
      <div className="content">
        <div className="submenu">这里是子菜单</div>
        <div className="content">{children}</div>
        <div></div>
      </div>
    </div>
  );
};

const NavMenuComponent = ({
  extra,
  navMode,
  selectedKey,
  dataSource,
  children,
}: {
  extra: React.ReactNode;
  navMode: "single" | "multi";
  selectedKey: string;
  dataSource: { [key: string]: any }[];
  children: React.ReactNode;
}) => {
  useEffect(() => {
    console.log("%c^-^", "color: #E32636", { dataSource });
  }, [dataSource]);

  return (
    <div className="nav-menu-component">
      {navMode === "single" && (
        <SingleNavComponent
          selectedKey={selectedKey}
          dataSource={dataSource}
          extra={extra}
        >
          {children}
        </SingleNavComponent>
      )}
      {navMode === "multi" && (
        <MultiNavComponent
          selectedKey={selectedKey}
          dataSource={dataSource}
          extra={extra}
        >
          {children}
        </MultiNavComponent>
      )}
    </div>
  );
};

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  const menu = useAppSelector(selectMenu);
  const selectedKey = useAppSelector(selectCurrentId);

  const appInfo = useMemo(() => {
    if (navMode === "single") return <div>single app Info</div>;
    if (navMode === "multi") return <div>multi app info</div>;
  }, [navMode]);

  useEffect(() => {
    console.log(
      "%c^-^",
      "color: #E32636",
      JSON.stringify({ theme, navMode }, null, 2)
    );
  }, [theme, navMode]);

  return (
    <div className="app-setup-preview">
      <NavMenuComponent
        selectedKey={selectedKey}
        dataSource={menu}
        navMode={navMode}
        extra={appInfo}
      >
        这里是内容区
      </NavMenuComponent>
    </div>
  );
};

export default AppSetupPreview;
