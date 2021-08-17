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

export type DataConfig = {
  api: number;
  request: {
    required: ParamSchem[];
    customize: ParamSchem[];
  };
  response?: Pick<ParamSchem, 'name'>[];
};

export type Field = {
  name: string;
  id: string;
};
