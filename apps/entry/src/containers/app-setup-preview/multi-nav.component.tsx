import { useMemo, useCallback } from "react";
import { Menu } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setCurrentMenu } from "@/views/app-setup/menu-setup.slice";
import { findFirstChild, findParentMenu, keyPath, getPopupContainer, findItem } from "@utils/utils";
import { HomeSubAppType } from "@/consts";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import { Icon, Text } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import UserComponent from "@components//header/user";
import "@containers/app-setup-preview/multi-nav.style";

const { SubMenu } = Menu;

const MultiNavComponent = ({ children, extra, dataSource, selectedKey, theme }: MenuComponentProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const submenu = useMemo(() => {
    const currentKey = keyPath(selectedKey, dataSource).shift() || selectedKey;
    const selectMenu = dataSource.find((item) => item.id === currentKey);
    return selectMenu?.children || [];
  }, [dataSource, selectedKey]);

  const activeMainKey = useMemo(
    () => keyPath(selectedKey, dataSource).shift() || selectedKey,
    [selectedKey, dataSource],
  );
  // 是否有二级菜单
  const hasSubMenu = useMemo(() => {
    if (!Array.isArray(dataSource) || dataSource.length < 1) {
      return false;
    }
    const id = findParentMenu(selectedKey, dataSource);
    const menu = dataSource.find((v) => v.id === id);
    return menu && menu.children?.length > 0;
  }, [dataSource, selectedKey]);

  const navigateFn = useCallback(
    (menu: IMenu) => {
      const {
        form: {
          assetConfig: { subAppType, subAppId },
        },
      } = menu;
      let url = "";
      console.log({ subAppType });
      // 流程类子应用
      if (subAppType === (HomeSubAppType.FLOW as unknown) && subAppId) {
        url = `./instance/${subAppId}`;
      } else if (subAppType === (HomeSubAppType.TASK_CENTER as unknown)) {
        url = `./task-center`;
      } else if (subAppType === (HomeSubAppType.INSTANCE_MANAGER as unknown)) {
        url = `./data-manage`;
      }
      navigate(url);
    },
    [navigate],
  );

  const handleMainMenuClick = useMemoCallback(({ key }) => {
    const menu = dataSource.find((v) => v.id === key);
    if (menu) {
      const subMenu = findFirstChild(menu);
      dispatch(setCurrentMenu(subMenu.id));
      if (menu?.id !== key) {
        navigateFn(subMenu);
      }
    } else {
      dispatch(setCurrentMenu(key));
    }
  });
  const handleTitleClick = useMemoCallback(({ key }) => {
    const menu = findItem(key, dataSource);
    dispatch(setCurrentMenu(key));
    navigateFn(menu);
  });
  const handleSubMenuClick = useMemoCallback(({ key }) => {
    const menu = findItem(key, dataSource);

    dispatch(setCurrentMenu(key));

    if (selectedKey !== key) {
      navigateFn(menu);
    }
  });

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
            onClick={handleMainMenuClick}
            getPopupContainer={getPopupContainer}
          >
            {dataSource.map((menu) => (
              <Menu.Item key={menu.id} icon={renderIcon(menu?.form?.icon)}>
                <Text>{menu.name}</Text>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div className="user-container">
          <UserComponent showProject={true} />
        </div>
      </div>
      <div className="content">
        {hasSubMenu && (
          <div className="submenu">
            <Menu
              mode="inline"
              inlineCollapsed={false}
              selectedKeys={[selectedKey]}
              openKeys={keyPath(selectedKey, submenu)}
            >
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
                        <Menu.Item key={menu.id} icon={renderIcon(menu?.form?.icon)} onClick={handleSubMenuClick}>
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
