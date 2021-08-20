/* 权限相关接口 */
import { builderAxios, runtimeAxios } from '@utils';

// 获取全部项目权限
export function fetchProjectList() {
  return builderAxios.get('/project/list/all/powers');
}
export type AssignAuthParams = {
  ownerKey: string;
  ownerType: number;
  power: number;
  resourceKey: string;
  resourceType: number;
};
// 分配资源权限
export function assignAuth(params: AssignAuthParams) {
  return runtimeAxios.post('/privilege/assign', params);
}
export type RevokeAuthParams = {
  id: number;
  ownerType: number;
  power: number;
};
// 回收资源权限
export function revokeAuth(params: RevokeAuthParams) {
  return runtimeAxios.delete('/privilege/revoke', { data: params });
}
