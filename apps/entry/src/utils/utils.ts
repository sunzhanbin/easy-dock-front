import { Menu } from "@utils/types";
import { axios } from "@utils/fetch";
import { AbstractTooltipProps } from "antd/lib/tooltip";

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

// 根据后端返回的图片id转化成图片url地址
export const imgIdToUrl = async (id: string) => {
  const res = await axios.get(`/file/download/${id}`, {
    responseType: "blob",
  });
  const blob = new Blob([res as any]);
  const url: string = window.URL.createObjectURL(blob);
  return url;
};
