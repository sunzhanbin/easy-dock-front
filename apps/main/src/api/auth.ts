/* 权限相关接口 */
import { builderAxios, runtimeAxios } from '@utils';

// 获取项目的访问权限
export function fetchProjectPowers() {
  return builderAxios.get('/project/list/all/powers');
}
export type AssignAuthParams = {
  ownerKey: string;
  ownerType: number;
  power: number;
  resourceKey: string;
  resourceType: number;
};
// 分配单个资源权限
export function assignAuth(params: AssignAuthParams) {
  return runtimeAxios.post('/privilege/assign', params);
}
export type RevokeAuthParams = {
  id: number;
  ownerType: number;
  power: number;
};
// 回收单个资源权限
export function revokeAuth(params: RevokeAuthParams) {
  return runtimeAxios.delete('/privilege/revoke', { data: params });
}
export type Privilege = {
  ownerKey: string;
  ownerType: number;
  power: number;
};
export type SubAppAuthParams = {
  id: string;
  privileges: Privilege[];
};
export type AppAuthParams = {
  id: string;
  dataPrivileges: Privilege[];
  subapps: SubAppAuthParams[];
};
// 分配应用资源权限
export function assignAppAuth(params: AppAuthParams) {
  return runtimeAxios.post('/privilege/assign/app', params);
}
// 获取应用的访问权限
export function fetchSubAppPowers(id: string) {
  return runtimeAxios.get(`/app/${id}/list/all/powers`);
}

// 搜索全部用户
export function fetchAllUser(params: { index: number; size: number; keyword: string }) {
  return runtimeAxios.post('/user/search/all', params);
}
