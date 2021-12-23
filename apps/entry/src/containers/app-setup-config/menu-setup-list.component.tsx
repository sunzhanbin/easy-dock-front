import React, { useCallback, useMemo } from "react";
import { Button, Collapse } from "antd";
import { v4 as uuid } from "uuid";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectMenu,
  selectCurrentId,
  setCurrentMenu,
  add,
  remove,
} from "@views/app-setup/menu-setup.slice";
import { Menu } from "@utils/types";
import { Icon, Text, PopoverConfirm } from "@common/components";
import { findItem, handleStopPropagation } from "@utils/utils";
import "@containers/app-setup-config/menu-setup-list.style";
import useMemoCallback from "@common/hooks/use-memo-callback";

const { Panel } = Collapse;

type BeforeIdChange = () => void;

// 菜单单元组件；
const MenuItemComponent = ({
  menu,
  onBeforeIdChange,
}: {
  menu: Menu;
  onBeforeIdChange: BeforeIdChange;
}) => {
  const dispatch = useAppDispatch();
  const currentId = useAppSelector(selectCurrentId);

  const style = useMemo(() => {
    return { paddingLeft: `${menu.depth * 12 + 18}px` };
  }, [menu.depth]);

  const renderIcon = useMemoCallback((icon) => {
    if (!icon || icon === "wukongjian") {
      return null;
    }
    return <Icon type={icon} className="icon" />;
  });

  const handleAddMenu = useCallback(
    async (e: React.MouseEvent, currentId: string) => {
      e.stopPropagation();
      await onBeforeIdChange();
      const childId = uuid();
      dispatch(add({ currentId, childId }));
    },
    []
  );

  const handleRemoveMenu = useCallback((currentId: string) => {
    dispatch(remove(currentId));
  }, []);

  const handleMenuClick = useCallback(
    async (e: React.MouseEvent, currentId: string) => {
      e.stopPropagation();
      await onBeforeIdChange();
      dispatch(setCurrentMenu(currentId));
    },
    []
  );
  return (
    <div
      className={classnames({
        "menu-item": true,
        active: currentId == menu.id,
      })}
      style={style}
    >
      {renderIcon(menu?.form?.icon)}
      <div className="text" onClick={(e) => handleMenuClick(e, menu.id)}>
        <Text text={menu.name} />
      </div>
      <div className="operation">
        {menu.depth < 2 && (
          <div className="add" onClick={(e) => handleAddMenu(e, menu.id)}>
            <Icon type="xinzeng" />
          </div>
        )}
        <PopoverConfirm
          title="提示"
          placement="bottom"
          content="删除后不可恢复,请确认是否删除该菜单?"
          trigger={["hover"]}
          onConfirm={handleRemoveMenu.bind(null, menu.id)}
        >
          <div className="remove" onClick={handleStopPropagation}>
            <Icon type="shanchu" />
          </div>
        </PopoverConfirm>
        <div className="drag">
          <Icon type="caidan" />
        </div>
      </div>
    </div>
  );
};

// 菜单嵌套逻辑组件；
const MenuComponent = ({
  menu,
  onBeforeIdChange,
}: {
  menu: Menu;
  onBeforeIdChange: BeforeIdChange;
}) => {
  const currentId = useAppSelector(selectCurrentId);
  const menuList = useAppSelector(selectMenu);
  const currentItem: any = findItem(currentId, menuList);
  const style = useMemo(() => {
    return { left: `${menu.depth * 12}px` };
  }, [menu.depth]);
  return (
    <div className="menu-component">
      {menu?.children?.length ? (
        <Collapse
          className="menu-collapse"
          defaultActiveKey={currentItem.parentId}
          ghost
          expandIcon={({ isActive }) =>
            isActive ? (
              <Icon type="xiasanjiao" style={style} />
            ) : (
              <Icon type="yousanjiao" style={style} />
            )
          }
        >
          <Panel
            key={menu.id}
            className="menu-collapse-panel"
            header={
              <MenuItemComponent
                menu={menu}
                onBeforeIdChange={onBeforeIdChange}
              />
            }
          >
            <div className="men-wrap">
              <div className="children">
                {menu.children.map((item, index: number) => (
                  <MenuComponent
                    key={index}
                    menu={item}
                    onBeforeIdChange={onBeforeIdChange}
                  />
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      ) : (
        <MenuItemComponent menu={menu} onBeforeIdChange={onBeforeIdChange} />
      )}
    </div>
  );
};

// 菜单容器组件；
const MenuSetupListComponent = ({
  onBeforeIdChange,
}: {
  onBeforeIdChange: BeforeIdChange;
}) => {
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const handleAddMenu = useCallback(async () => {
    await onBeforeIdChange();

    const childId = uuid();
    dispatch(add({ currentId: null, childId }));
  }, []);

  return (
    <div className="menu-setup-list-component">
      <div className="create">
        <Button
          className="button"
          type="primary"
          size="large"
          ghost
          icon={<Icon type="xinzeng" />}
          onClick={handleAddMenu}
        >
          添加一级菜单
        </Button>
      </div>
      <div className="menu">
        {menu?.map((child: any, index: number) => (
          <MenuComponent
            key={index}
            menu={child}
            onBeforeIdChange={onBeforeIdChange}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSetupListComponent;
