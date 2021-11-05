export type Api = {
  id: number;
  name: string;
  url: string;
  version: string;
};

export enum Location {
  BODY = 'body',
  HEAD = 'head',
  QUERY = 'query',
  PATH = 'path',
}

export enum ParamType {
  Customize = 1,
  Optional = 2,
  Required = 3,
}

export type ParamSchem = {
  location?: Location;
  name: string;
  map?: string;
  type: ParamType;
};

export type ResponseSchem =
  | {
      name: string;
    }
  | Omit<ParamSchem, 'location'>[];

export enum ApiType {
  ORCH_SERVICE = 1, // 已有接口,服务编排来的
  CUSTOM = 2, // 自定义接口
}
export enum MethodType {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type DataConfig = {
  type: ApiType;
  id?: number; // type为1时 id才有值
  url?: string; // type为2时,url才有值
  method?: MethodType; // type为2时,method才有值
  request: {
    required: ParamSchem[];
    customize: ParamSchem[];
  };
  response?: ResponseSchem;
};

export type Field = {
  name: string;
  id: string;
};
