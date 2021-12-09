import { useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined, MenuOutlined, RestOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectMenu,
  selectCurrentId,
  setCurrentMenu,
  add,
  remove,
} from "@/views/app-setup/menu-setup.slice";
import { v4 as uuid } from "uuid";
import classnames from "classnames";
import "./menu-setup-list.style";

// 菜单单元组件；
const MenuItemComponent = ({ menu }: any) => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector(selectCurrentId);

  const handleAddMenu = useCallback((currentId: string) => {
    const childId = uuid();
    dispatch(add({ currentId, childId }));
  }, []);

  const handleRemoveMenu = useCallback((currentId: string) => {
    dispatch(remove(currentId));
  }, []);

  const handleMenuClick = useCallback((currentId: string) => {
    dispatch(setCurrentMenu(currentId));
  }, []);

  return (
    <div
      className={classnames({
        "menu-item": true,
        active: currentId == menu.id,
      })}
    >
      <span className="text" onClick={handleMenuClick.bind(null, menu.id)}>
        {menu.name}
      </span>
      <span className="acts">
        <span className="item add" onClick={handleAddMenu.bind(null, menu.id)}>
          <PlusOutlined />
        </span>
        <span
          className="item remove"
          onClick={handleRemoveMenu.bind(null, menu.id)}
        >
          <RestOutlined />
        </span>
        <span className="item drag">
          <MenuOutlined />
        </span>
      </span>
    </div>
  );
};

// 菜单嵌套逻辑组件；
const MenuComponent = ({ menu }: any) => {
  return (
    <>
      {menu?.children?.length ? (
        <div className="men-wrap">
          <MenuItemComponent menu={menu} />
          <div className="children">
            {menu.children.map((item: any, index: number) => (
              <MenuComponent key={index} menu={item} />
            ))}
          </div>
        </div>
      ) : (
        <MenuItemComponent menu={menu} />
      )}
    </>
  );
};

// 菜单容器组件；
const MenuSetupListComponent = () => {
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);

  const handleAddMenu = useCallback(() => {
    const childId = uuid();
    dispatch(add({ currentId: null, childId }));
  }, []);

  return (
    <div className="menu-setup-list-component">
      <div className="header">菜单设置</div>
      <div className="list">
        <div className="addMenu">
          <Button onClick={handleAddMenu}>添加一级菜单</Button>
        </div>
        <div className="menu">
          {menu?.map((child: any, index: number) => (
            <MenuComponent key={index} menu={child} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSetupListComponent;