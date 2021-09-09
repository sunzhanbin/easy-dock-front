import { Api, Location } from '@type/api';
import { axios } from '@utils';

type ParamData = { name: string; from?: string; hasRequired?: 1 | 0; properties?: ParamData[]; paramMode?: 2 };
export type ParamReturn = { name: string; from?: Location; required: boolean };

export function formatPrams(data: ParamData[]) {
  let prevs: string[] = [];

  function loop(data: ParamData[], params: ParamReturn[], parentRequired?: boolean) {
    data.forEach((item) => {
      if (item.paramMode !== 2) {
        prevs.push(item.name);
      }

      if (item.properties && item.properties.length > 0) {
        loop(item.properties, params, parentRequired || item.hasRequired === 1);
      } else {
        const param: ParamReturn = {
          name: prevs.join('.'),
          required: Boolean(item.hasRequired === 1 || parentRequired),
        };

        if (item.from === 'query') {
          param.from = Location.QUERY;
        } else if (item.from === 'header') {
          param.from = Location.HEAD;
        } else if (param.from === 'path') {
          param.from = Location.PATH;
        } else if (param.from === 'body') {
          param.from = Location.BODY;
        }
        params.push(param);
      }

      if (item.paramMode !== 2) {
        prevs = prevs.slice(0, -1);
      }
    });

    return params;
  }

  return loop(data, []);
}

const useMock = false;

if (useMock && process.env.NODE_ENV === 'development') {
  require('./mock');
}

const orchPrefix = '/api/api-orchestration-service-main/interfaceManage/v1';
const baseURL = useMock ? '/' : window.ORCH_SERVICE_ENDPOINT;

export async function queryApiDetail(
  api: number,
  hasResponse?: boolean,
): Promise<[ParamReturn[], ParamReturn[], ParamReturn[]]> {
  return axios
    .get(`${orchPrefix}/queryInterfaceInfo?id=${api}`, {
      baseURL,
    })
    .then(({ data }) => {
      let head: ParamReturn[] = [];
      let body: ParamReturn[] = [];
      let response: ParamReturn[] = [];

      if (!data) return [head, body, response];

      if (data.headerContent) {
        head = formatPrams(JSON.parse(data.headerContent));
      }

      if (data.requestParamContent) {
        body = formatPrams(JSON.parse(data.requestParamContent));
      }

      if (data.responseParamContent && hasResponse) {
        response = formatPrams(JSON.parse(data.responseParamContent));
      }

      const requireds: ParamReturn[] = [];
      const optionals: ParamReturn[] = [];

      [...head, ...body].forEach((item) => {
        if (item.required) {
          requireds.push(item);
        } else {
          optionals.push(item);
        }
      });

      return [requireds, optionals, response];
    });
}

export async function queryApis(): Promise<Api[]> {
  return axios
    .get<{ data: Api[] }>(`${orchPrefix}/listInfoForAll`, {
      baseURL,
    })
    .then(({ data }) => {
      return data;
    });
}
