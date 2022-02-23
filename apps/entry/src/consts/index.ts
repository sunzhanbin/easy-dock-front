import Auth from "@enc/sso";

export * from "./validators";
export * from "./type";

export const CANVAS_ENTRY = window.CANVAS_FRONTEND_ENTRY;
export const SPACE_ENTRY = window.SPACE_FRONTEND_ENTRY;
export const FLOW_ENTRY = window.FLOW_FRONTEND_ENTRY;
export const MAIN_ENTRY = window.MAIN_FRONTEND_ENTRY;
export const IOT_ENTRY = window.IOT_FRONTEND_ENTRY;
export const DATA_FISH_ENTRY = window.DATA_FISH_FRONTEND_ENTRY;
export const INTERFACE_ENTRY = window.INTERFACE_FRONTEND_ENTRY;
export const MICRO_FLOW_ENTRY = window.MICRO_FLOW_FRONTEND_ENTRY;

export const auth = new Auth();

export const TASK_STATE_LIST: { key: number; value: string }[] = [
  { key: 1, value: "进行中" },
  { key: 2, value: "已终止" },
  { key: 3, value: "已撤回" },
  { key: 4, value: "已办结" },
  { key: 5, value: "已驳回" },
  { key: 6, value: "等待中" },
];
