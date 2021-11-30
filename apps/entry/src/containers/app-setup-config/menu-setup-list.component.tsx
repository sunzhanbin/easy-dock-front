import { useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined, MenuOutlined, RestOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectMenu, add } from "@/views/app-setup/menu-setup.slice";
import { v4 as uuid } from "uuid";
import "./menu-setup-list.style";

const MenuItemComponent = ({ menu }: any) => {
  const dispatch = useAppDispatch();

  const handleAddMenu = useCallback((currentId: string) => {
    const childId = uuid();
    dispatch(add({ currentId, childId }));
  }, []);

  return (
    <div className="menu-item">
      <span className="text">{menu.name}</span>
      <span className="acts">
        <span className="item add" onClick={handleAddMenu.bind(null, menu.id)}>
          <PlusOutlined />
        </span>
        <span className="item remove">
          <RestOutlined />
        </span>
        <span className="item drag">
          <MenuOutlined />
        </span>
      </span>
    </div>
  );
};

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
