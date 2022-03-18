import { Menu } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { findFirstChild, findItem } from "@utils/utils";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import { HomeSubAppType } from "@/consts";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon, Text } from "@common/components";
import UserComponent from "@components//header/user";
import { useAppDispatch } from "@/store";
import { setCurrentMenu } from "@/views/app-setup/menu-setup.slice";
import "@containers/app-setup-preview/single-nav.style";
import { useCallback } from "react";

const { SubMenu } = Menu;

const SingleNavComponent = ({ children, extra, dataSource, selectedKey, theme }: MenuComponentProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const renderIcon = useMemoCallback((icon) => {
    if (!icon || icon === "wukongjian") {
      return null;
    }
    return <Icon type={icon} />;
  });

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

  const handleMenuClick = useMemoCallback(({ key }) => {
    const menu = dataSource.find((v) => v.id === key);
    if (menu) {
      const subMenu = findFirstChild(menu);
      dispatch(setCurrentMenu(subMenu.id));
    } else {
      dispatch(setCurrentMenu(key));
    }
  });
  const handleTitleClick = useMemoCallback(({ key }) => {
    const menu = dataSource.find((v) => v.id === key);
    if (menu) {
      const subMenu = findFirstChild(menu);
      dispatch(setCurrentMenu(subMenu.id));
      if (subMenu.id !== selectedKey) {
        navigateFn(subMenu);
      }
    } else {
      dispatch(setCurrentMenu(key));
    }
  });
  const handleSubMenuClick = useMemoCallback(({ key }) => {
    const menu = findItem(key, dataSource);

    dispatch(setCurrentMenu(key));

    if (selectedKey !== key) {
      navigateFn(menu);
    }
  });

  return (
    <div className={classNames("single-nav-component", theme)}>
      <div className="left">
        <div className="extra">{extra}</div>
        <div className="menu">
          <Menu
            mode="inline"
            style={{ width: 256 }}
            inlineCollapsed={false}
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
          >
            {/* @Todo 此处和菜单设置里的嵌套组件不同，antd 组件嵌套时，key 的数据丢失 */}
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
                      <Menu.Item key={menu.id} icon={renderIcon(menu.form?.icon)} onClick={handleSubMenuClick}>
                        <Text className="menu-text">{menu.name}</Text>
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
            <UserComponent showProject={true} theme={theme} />
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default SingleNavComponent;
