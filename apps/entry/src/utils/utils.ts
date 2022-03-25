import React from "react";
import cookie from "js-cookie";
import { Menu, OwnerTypeEnum, Power, UserOwner } from "@utils/types";
import { axios } from "@utils/fetch";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import {
  CANVAS_ENTRY,
  MAIN_ENTRY,
  HomeSubAppType,
  INTERFACE_ENTRY,
  ResponseType,
  SPACE_ENTRY,
  IOT_ENTRY,
  SubAppType,
  DATA_FISH_ENTRY,
} from "@/consts";

export const getPopupContainer: AbstractTooltipProps["getPopupContainer"] = (container) => container;

export const findItem = (id: string, menus: Menu[]): Menu => {
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

export const filterItem = (id: string | number, key: string, menus: Menu[]) => {
  const filterMenu = menus.filter((item) => item[key as keyof Menu] !== id);
  filterMenu.forEach((item) => {
    const recurse = (id: string | number, key: string, item: Menu) => {
      const index = item.children.findIndex((child) => child[key as keyof Menu] === id);
      if (index >= 0) {
        item.children.splice(index, 1).forEach((child) => recurse(id, key, child));
      } else {
        item.children.forEach((child) => recurse(id, key, child));
      }
    };
    recurse(id, key, item);
  });
  return filterMenu;
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
// 找到菜单下子菜单中的第一个叶子节点,如果没有则返回菜单本身
export const findFirstChild = (menu: Menu): Menu => {
  if (menu?.children.length > 0) {
    return findFirstChild(menu.children[0]);
  }
  return menu;
};
// 向上找到一级菜单的id
export const findParentMenu = (id: string, menus: Menu[]): string => {
  const menu = findItem(id, menus);
  if (menu.depth === 1) {
    return menu.id;
  }
  if (menu && menu.parentId) {
    return findParentMenu(menu.parentId!, menus);
  }
  return "";
};

// 根据后端返回的图片id转化成图片url地址
export const imgIdToUrl = async (id: string) => {
  const res = await axios.get(`/file/download/${id}`, {
    responseType: "blob",
  });
  const blob = new Blob([res as any]);
  const url: string = window.URL.createObjectURL(blob);
  return url;
};

/**
 * 不同类型子应用跳转
 * @param type 子应用类型
 * @param id 子应用id
 * @param getCanvasId 大屏接口
 * @param getHoloSceneId 空间接口
 * @constructor
 */
export const JumpLinkToUrl = async (
  type: number,
  id: number,
  getCanvasId: (v: number) => Promise<any>,
  getHoloSceneId: (v: number) => Promise<any>,
) => {
  if (type === HomeSubAppType.CANVAS) {
    const { data: canvasData }: ResponseType = await getCanvasId(id);
    if (!canvasData) return;
    // 大屏跳转需要拼sso=true保证用户信息不丢失
    window.open(`${CANVAS_ENTRY}/dashboard/${canvasData.refId}?sso=true`);
  } else if (type === HomeSubAppType.SPACE) {
    const { data: spaceData }: ResponseType = await getHoloSceneId(id);
    if (!spaceData) return;
    window.open(`${SPACE_ENTRY}/#/scene/${spaceData.refId}`);
  } else if (type === HomeSubAppType.FLOW) {
    window.open(`${MAIN_ENTRY}/main/builder/flow/bpm-editor/${id}/form-design?theme=light`);
  } else if (type === HomeSubAppType.FORM) {
    // window.open(`${MAIN_ENTRY}/builder/flow/bpm-editor/${id}/form-design`);
  } else if (type === HomeSubAppType.DEVICE) {
    window.open(`${IOT_ENTRY}/product`);
  } else if (type === HomeSubAppType.INTERFACE) {
    window.open(`${INTERFACE_ENTRY}/orch`);
  } else if (type === HomeSubAppType.DATA_FISH) {
    window.open(`${DATA_FISH_ENTRY}/#/modelManagement?theme=light`);
  }
};

export function exportFile(res: any, name: string, type?: string) {
  const blobConfig = type ? { type } : {};
  const blob = new Blob([res], blobConfig);
  const urlObject = window.URL || window.webkitURL || window;
  const save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a") as HTMLAnchorElement;

  save_link.href = urlObject.createObjectURL(blob);
  if (name) {
    save_link.download = name;
  }
  save_link.click();
}

export const handleStopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

// 获取第一层叶子结点children
export const deepSearch = (array: any[]) => {
  const item = array[0];
  for (const key in item) {
    if (key === "children" && item.children && item.children.length) {
      deepSearch(item.children);
    } else {
      return item.children.length ? item.children[0] : item;
    }
  }
};

// 已有资产/自定义URL保存时过滤只保留一个生效 另一个恢复到初始状态
export const filterAssetConfig = (menuList: any[]) => {
  const menu = [...menuList];
  for (const i in menu) {
    const menuItem = menu[i];
    let { form: menuForm } = menuItem;
    if (menuForm.asset === "exist") {
      menuForm = Object.assign({}, menuForm, {
        assetConfig: {
          ...menuForm.assetConfig,
          url: "",
        },
      });
    } else {
      menuForm = Object.assign({}, menuForm, {
        assetConfig: {
          ...menuForm.assetConfig,
          subAppType: SubAppType.FORM,
          subAppId: undefined,
        },
      });
    }
    menuItem.form = JSON.parse(JSON.stringify(menuForm));
    if (menuItem.children && menuItem.children.length) {
      filterAssetConfig(menuItem.children);
    }
  }
  return menu;
};

export const getVisitor = (powers: Power[]) => {
  const powerList: Power[] = JSON.parse(JSON.stringify(powers));
  const members = powerList
    ?.filter((power) => power.ownerType === OwnerTypeEnum.USER)
    ?.map((power) => Object.assign(power.owner, { name: (power.owner as UserOwner).userName }));
  const departs = powerList
    ?.filter((power) => power.ownerType === OwnerTypeEnum.DEPARTMENT)
    .map((power) => power.owner);
  const roles = powerList?.filter((power) => power.ownerType === OwnerTypeEnum.ROLE).map((power) => power.owner);
  return { members, departs, roles };
};

export const clearCookies = () => {
  const cookies = cookie.get();
  if (cookies) {
    Object.keys(cookies).forEach((key) => {
      cookie.remove(key);
    });
  }
};
