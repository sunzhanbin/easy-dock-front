import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import { QueryReturnValue } from "@utils/types";
import { clearCookies } from "./utils";

const handleHttpError = (
  httpStatus: number | "FETCH_ERROR" | "PARSING_ERROR" | "CUSTOM_ERROR",
  msg?: string,
): string => {
  const url = `${window.SSO_LOGIN_URL || process.env.REACT_APP_SSO_LOGIN_URL}/logout?redirectUri=${encodeURIComponent(
    window.location.href,
  )}`;
  let errorMsg = "";
  switch (httpStatus) {
    case 400:
      errorMsg = msg || "错误的请求参数";
      break;
    case 401:
      errorMsg = "您没有登录,请先登录";
      if (window.Auth && window.Auth.getAuth()) {
        setTimeout(() => {
          // 重定向前先清除cookie
          clearCookies();
          window.Auth.logout(url);
        }, 2500);
      }
      break;
    case 403:
      errorMsg = "登录过期,请重新登录";
      if (window.Auth && window.Auth.getAuth()) {
        setTimeout(() => {
          // 重定向前先清除cookie
          clearCookies();
          window.Auth.logout(url);
        }, 2500);
      }
      break;
    case 404:
      errorMsg = "请求的资源不存在";
      break;
    case 500:
      errorMsg = "服务异常";
      break;
    default:
      errorMsg = "请求错误";
      break;
  }
  return errorMsg;
};

const createBaseQuery = (mode: "builder" | "runtime") => {
  const baseUrl = `${
    window.EASY_DOCK_BASE_SERVICE_ENDPOINT || process.env.REACT_APP_EASY_DOCK_BASE_SERVICE_ENDPOINT
  }/enc-oss-easydock/api/${mode}/v1`;
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const auth = window.Auth?.getAuth();
      headers.set("auth", auth);
      return headers;
    },
  });
};

const createQueryWithIntercept = (
  result: QueryReturnValue<any, FetchBaseQueryError, FetchBaseQueryMeta>,
  silence?: boolean,
) => {
  const { data, error } = result;
  let resultMessage = data?.resultMessage;
  if (error) {
    const { status, data } = error as FetchBaseQueryError;
    resultMessage = handleHttpError(status as number, (data as { resultMessage: string })?.resultMessage);
    if (!silence) {
      message.error(resultMessage);
    }
  }
  if (Object.is(data?.resultCode, 0)) {
    Object.prototype.hasOwnProperty.call(data, "resultCode") && delete data.resultCode;
    Object.prototype.hasOwnProperty.call(data, "resultMessage") && delete data.resultMessage;
    return data;
  }
  return {
    error: {
      code: -1,
      resultMessage,
    },
  };
};

const builderQuery = createBaseQuery("builder");
const runtimeQuery = createBaseQuery("runtime");

export const builderQueryWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result: QueryReturnValue<any, FetchBaseQueryError, FetchBaseQueryMeta> = await builderQuery(
    args,
    api,
    extraOptions,
  );
  const silence = (args as unknown as { silence: boolean })?.silence ?? false;
  return createQueryWithIntercept(result, silence);
};

export const runtimeQueryWithIntercept: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result: QueryReturnValue<any, FetchBaseQueryError, FetchBaseQueryMeta> = await runtimeQuery(
    args,
    api,
    extraOptions,
  );
  const silence = (args as unknown as { silence: boolean })?.silence ?? false;
  return createQueryWithIntercept(result, silence);
};
