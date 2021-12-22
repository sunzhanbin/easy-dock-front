import React from "react";
import { Menu } from "@utils/types";
import { axios } from "@utils/fetch";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import {
  CANVAS_ENTRY,
  FLOW_ENTRY,
  HomeSubAppType,
  INTERFACE_ENTRY,
  ResponseType,
  SPACE_ENTRY,
  WU_LIAN_ENTRY,
} from "@/consts";

export const getPopupContainer: AbstractTooltipProps["getPopupContainer"] = (
  container
) => container;

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
  getHoloSceneId: (v: number) => Promise<any>
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
    window.open(`${FLOW_ENTRY}/builder/flow/bpm-editor/${id}/flow-design`);
  } else if (type === HomeSubAppType.FORM) {
    window.open(`${FLOW_ENTRY}/builder/flow/bpm-editor/${id}/form-design`);
  } else if (type === HomeSubAppType.DEVICE) {
    window.open(WU_LIAN_ENTRY);
  } else if (type === HomeSubAppType.INTERFACE) {
    window.open(`${INTERFACE_ENTRY}/orch`);
  } else if (type === HomeSubAppType.DATA_FISH) {
    // todo
    window.open(`http://10.19.248.238:9003/#/scene/${id}`);
  }
};

export function exportFile(res: any, name: string, type?: string) {
  const blobConfig = type ? { type } : {};
  const blob = new Blob([res], blobConfig);
  const urlObject = window.URL || window.webkitURL || window;
  const save_link = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "a"
  ) as HTMLAnchorElement;

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
