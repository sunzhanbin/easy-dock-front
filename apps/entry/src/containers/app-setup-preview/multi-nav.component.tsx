import { useCallback, useMemo, useEffect } from "react";
import { Menu } from "antd";
import classNames from "classnames";
import { keyPath } from "@utils/utils";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import "@containers/app-setup-preview/multi-nav.style";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import UserComponent from "@components//header/user";

const { SubMenu } = Menu;

const MultiNavComponent = ({
  children,
  extra,
  dataSource,
  selectedKey,
  theme,
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
  // 是否有二级菜单
  const hasSubMenu = useMemo(() => {
    if (!Array.isArray(dataSource) || dataSource.length < 1) {
      return false;
    }
    return dataSource.some((menu) => menu.children?.length > 0);
  }, [dataSource]);

  const handleMainManu = useCallback(({ item, key, keyPath }) => {
    console.log("%c^_^ \n\n", "color: #C80815; font-weight: bolder", {
      item,
      key,
      keyPath,
    });
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
          <Menu
            mode="horizontal"
            selectedKeys={[activeMainKey]}
            onClick={handleMainManu}
          >
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
        {hasSubMenu && (
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
                      return (
                        <Menu.Item
                          key={menu.id}
                          icon={renderIcon(menu?.form?.icon)}
                        >
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
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default MultiNavComponent;
