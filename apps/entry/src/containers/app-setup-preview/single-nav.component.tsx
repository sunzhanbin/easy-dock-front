import { Menu } from "antd";
import classNames from "classnames";
import { findFirstChild, keyPath } from "@utils/utils";
import { Menu as IMenu, MenuComponentProps } from "@utils/types";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Icon, Text } from "@common/components";
import UserComponent from "@components//header/user";
import { useAppDispatch } from "@/store";
import { setCurrentMenu } from "@/views/app-setup/menu-setup.slice";
import "@containers/app-setup-preview/single-nav.style";

const { SubMenu } = Menu;

const SingleNavComponent = ({
  children,
  extra,
  dataSource,
  selectedKey,
  theme,
}: MenuComponentProps) => {
  const dispatch = useAppDispatch();
  const renderIcon = useMemoCallback((icon) => {
    if (!icon || icon === "wukongjian") {
      return null;
    }
    return <Icon type={icon} />;
  });
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
    } else {
      dispatch(setCurrentMenu(key));
    }
  });
  const handleSubMenuClick = useMemoCallback(({ key }) => {
    dispatch(setCurrentMenu(key));
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
            openKeys={keyPath(selectedKey, dataSource)}
          >
            {/* @Todo 此处和菜单设置里的嵌套组件不同，antd 组件嵌套时，key 的数据丢失 */}
            {((dataSource) => {
              const recurse = (menus: IMenu[]) => {
                return menus.map((menu) => {
                  if (menu?.children?.length) {
                    return (
                      <SubMenu
                        key={menu.id}
                        title={menu.name}
                        onTitleClick={handleTitleClick}
                      >
                        {recurse(menu.children)}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item
                        key={menu.id}
                        icon={renderIcon(menu.form?.icon)}
                        onClick={handleSubMenuClick}
                      >
                        <Text>{menu.name}</Text>
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
            <UserComponent />
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default SingleNavComponent;
