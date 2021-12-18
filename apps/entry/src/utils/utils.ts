import { Menu } from "@utils/types";
import { axios } from "@utils/fetch";
import { AbstractTooltipProps } from "antd/lib/tooltip";
import { HomeSubAppType, ResponseType } from "@/consts";

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
    window.open(
      `http://10.19.248.238:28180/dashboard/${canvasData.refId}?sso=true`
    );
  } else if (type === HomeSubAppType.SPACE) {
    const { data: spaceData }: ResponseType = await getHoloSceneId(id);
    if (!spaceData) return;
    window.open(`http://10.19.248.238:9003/#/scene/${spaceData.refId}`);
  } else if (type === HomeSubAppType.FLOW) {
    window.open(
      `http://10.19.248.238:28303/builder/flow/bpm-editor/${id}/flow-design`
    );
  } else if (type === HomeSubAppType.FORM) {
    window.open(
      `http://10.19.248.238:28303/builder/flow/bpm-editor/${id}/form-design`
    );
  }
};
