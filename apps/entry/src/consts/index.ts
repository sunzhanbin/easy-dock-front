export * from "./validators";
export * from "./type";

export const CANVAS_ENTRY = process.env.REACT_APP_CANVAS_FRONTEND_ENTRY;
export const SPACE_ENTRY = process.env.REACT_APP_SPACE_FRONTEND_ENTRY;
export const FLOW_ENTRY = process.env.REACT_APP_FLOW_FRONTEND_ENTRY;

export const TASK_STATE_LIST: { key: number; value: string }[] = [
  { key: 1, value: "进行中" },
  { key: 2, value: "已终止" },
  { key: 3, value: "已撤回" },
  { key: 4, value: "已办结" },
  { key: 5, value: "已驳回" },
  { key: 6, value: "等待中" },
];
