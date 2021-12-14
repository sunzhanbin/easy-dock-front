import { Menu } from "@utils/types";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import { SubAppType } from "@/consts";

export const getPopupContainer: AbstractTooltipProps["getPopupContainer"] = (
  container
) => container;

export const findItem = (id: string, menus: Menu[]) => {
  let result = {} as Menu;
  let hasFind: boolean;
  menus.forEach((item) => {
    const recurse = (id: string, item: Menu) => {
      if (hasFind) return;
      if (item.id === id) {
        result = item;
        hasFind = true;
      }
      item.children && item.children.forEach((child) => recurse(id, child));
    };
    recurse(id, item);
  });
  return result;
};

export const keyPath = (id: string, menus: Menu[]) => {
  let currentId = id;
  const keyPath: string[] = [];

  while (currentId) {
    keyPath.unshift(currentId);
    const menu = findItem(currentId, menus);
    const { parentId } = menu;
    currentId = parentId!;
  }

  keyPath.pop();

  return keyPath;
};

// 1=大屏类，2=流程类，3=报表类，4=HoloScene，5=表单类
export const getAppType = (type: string) => {
  switch (type) {
    case "icon_newform":
      return SubAppType.FORM;
    case "icon_newflow":
      return SubAppType.FLOW;
    case "icon_newchart":
      return SubAppType.CHART;
    case "icon_newcanvas":
      return SubAppType.CANVAS;
    case "icon_newspace":
      return SubAppType.SPACE;
    default:
      return 0;
  }
};
