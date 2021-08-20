import { SCENE_IAMGES } from '@consts';

export type AppSchema = {
  id: number;
  name: string;
  icon: keyof typeof SCENE_IAMGES;
  remark: string;
  status: 1 | -1;
  createTime: number;
};

export enum RoleEnum {
  TENEMENT = 1, //普通租户
  APP_MANAGER = 2, //应用管理员
  PROJECT_MANAGER = 4, //项目管理员
  ADMIN = 8, //超管
}
export enum AuthEnum {
  ADMIN = 1, //管理员权限
  DATA = 2, //数据权限
  VISIT = 4, //访问权限
}
// 资源类型
export enum ResourceTypeEnum {
  PROJECT = 1,
  APP = 2,
  SUB_APP = 3,
}
export enum OwnerTypeEnum {
  USER = 1, //用户
  ROLE = 2, //角色
  DEPARTMENT = 3, //部门
}
export enum SubAppTypeEnum {
  SCREEN = 1, //大屏类子应用
  FLOW = 2, //流程类子应用
}

export type Power = {
  id: number;
  owner: User;
  ownerType: number;
  resourceKey: string;
  resourceType: number;
};

export type ProjectPower = {
  createTime: number;
  id: number;
  name: string;
  powers: Power[]; //被授权的对象
  status: number;
};

export type SubAppPower = {
  createTime: number;
  id: number;
  name: string;
  powers: Power[]; //被授权的对象
  status: -1 | 1; //-1:停用 1:启用
  type: 1 | 2; //1:大屏类子应用 2:流程类子应用
};
