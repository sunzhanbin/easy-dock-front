import { MethodType } from "easy-flow-front/src/type/api";

export type Member = {
  name: string;
  id: number | string;
  avatar?: string;
};

export type Dept = {
  name: string;
  id: number | string;
  avatar?: string;
};

export type Role = {
  id: number | string;
  name: string;
  avatar?: string;
};

export interface PluginHttpParam {
  name: string;
  key: string;
  map?: string;
  required?: boolean;
}

export interface PluginMeta {
  url: string;
  method: MethodType;
  paths: PluginHttpParam[];
  headers: PluginHttpParam[];
  querys: PluginHttpParam[];
  bodys: PluginHttpParam[];
  responses: PluginHttpParam[];
}

export interface PluginJsonMeta {
  meta?: PluginMeta;
  type?: string; //暂时只支持http类型
  code?: string;
  name?: string;
  fileName?: string;
}

export interface PluginDataConfig {
  type?: string; //暂时只支持http类型
  code?: string;
  name?: string;
  id?: number;
  enabled?: boolean;
  openVisit?: boolean;
  meta?: PluginMeta;
}
