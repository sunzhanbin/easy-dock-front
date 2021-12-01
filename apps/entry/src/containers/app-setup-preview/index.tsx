import { useCallback, useEffect, useMemo } from "react";
import { useAppSelector } from "@/store";
import {
  selectTheme,
  selectNavMode,
} from "@/views/app-setup/basic-setup.slice";
import { selectMenu } from "@/views/app-setup/menu-setup.slice";
import "./index.style";

import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

const SingleNavComponent = ({ children, extra }: any) => {
  const handleMenuClick = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^", "color: #C80815", { item, key, keyPath });
  }, []);

  return (
    <div className="single-nav-component">
      <div className="sider">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu
            onClick={handleMenuClick}
            // style={{ width: 256 }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
          >
            <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
              <Menu.ItemGroup key="g1" title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup key="g2" title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <SubMenu
              key="sub2"
              icon={<AppstoreOutlined />}
              title="Navigation Two"
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
                <SubMenu key="sub3-1" title="subsubmenu">
                  <Menu.Item key="sub3-1-1">Option9</Menu.Item>
                  <Menu.Item>Option10</Menu.Item>
                </SubMenu>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              icon={<SettingOutlined />}
              title="Navigation Three"
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
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
        <SingleNavComponent extra={extra}>{children}</SingleNavComponent>
      )}
      {navMode === "multi" && (
        <MultiNavComponent extra={extra}>{children}</MultiNavComponent>
      )}
    </div>
  );
};

const AppSetupPreview = () => {
  const theme = useAppSelector(selectTheme);
  const navMode = useAppSelector(selectNavMode);
  const menu = useAppSelector(selectMenu);

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
        selectedKey=""
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
