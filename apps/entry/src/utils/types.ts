import { NavModeType, SubAppType, ThemeType } from "@/consts";
import React from "react";

export type User = {
  avatar: string; // 头像
  username: string; // 中文名
  id: number; //登录名
  power?: number; //权限值
  name?: string;
};

// 子应用信息
export type AppSchema = {
  id: number;
  name: string;
  icon: string;
  remark: string;
  status: 1 | -1;
  createTime: number;
  power: number;
};

export type AppInfo = {
  id: number;
  name: string;
  project: {
    id: number;
    name: string;
  };
};

export type Privilege = {
  ownerKey: string;
  ownerType: number;
  power: number;
};
export type SubAppAuthParams = {
  id: string;
  openVisit?: boolean;
  privileges: Privilege[];
};

export type AppAuthParams = {
  id: string;
  openVisit?: boolean;
  dataPrivileges: Privilege[];
  subapps: SubAppAuthParams[];
};

// 1=大屏类，2=流程类，3=报表类，4=HoloScene，5=表单类
export enum SubAppTypeEnum {
  SCREEN = 1, // 大屏类子应用
  FLOW = 2, // 流程类子应用
  SPACE = 4, // 空间类子应用
}

export enum RoleEnum {
  TENEMENT = 1, //普通租户
  APP_MANAGER = 2, //应用管理员
  PROJECT_MANAGER = 4, //项目管理员
  ADMIN = 8, //超管
}

export type RevokeAuthParams = {
  id: number;
  ownerType: number;
  power: number;
};

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

export type AssignAuthParams = {
  ownerKey: string;
  ownerType: number;
  power: number;
  resourceKey: string;
  resourceType: number;
};
export type UserOwner = {
  id: number | string; //登录名
  avatar?: string; // 头像
  userName?: string; // 中文名
  name: string;
};
export type DepartOwner = {
  id: number | string;
  code?: string;
  name: string;
  parentId?: number;
};
export type RoleOwner = {
  id: number | string;
  name: string;
};
export type Power = {
  id: number;
  owner: UserOwner | DepartOwner | RoleOwner;
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

export type Tenant = {
  code: string;
  name: string;
};

export type SubAppPower = {
  createTime: number;
  id: number;
  name: string;
  powers: Power[]; //被授权的对象
  status: -1 | 1; //-1:停用 1:启用
  type: 1 | 2 | 4; //1:大屏类子应用 2:流程类子应用 4:空间类子应用
  openVisit?: boolean; //所有人可访问
};

export interface workspaceShape {
  name: string;
  id: number;
  status: -1 | 1;
  icon: string;
  remark: string;
  version: {
    id: number;
    version: string;
  };
}

export interface SubAppInfo {
  id: number;
  name: string;
  status: -1 | 1;
  type: 1 | 2;
  version: {
    id: number;
    remark: string;
    version: string;
  };
}

export interface AppManagerInitialState {
  currentWorkspaceId: number;
}

export interface BasicSetupInitialState {
  theme: ThemeType;
  navMode: NavModeType;
  logo: string;
  basicForm: { [key: string]: any };
  errors: string[];
}

export interface MenuSetupInitialState {
  currentId: string;
  menu: Menu[];
  menuForm: MenuSetupForm;
}

export interface WorkspaceInitialState {
  name: string;
  navMode: NavModeType;
  menu: Menu[];
  currentId: string;
  appId: string;
  projectId: string;
}

export interface Menu {
  depth: number;
  children: Menu[];
  form: MenuSetupForm;
  id: string;
  name: string;
  parentId: string | null;
}

export interface MenuSetupForm {
  name: string;
  icon: string;
  mode: "blank" | "current";
  asset: "exist" | "custom";
  assetConfig: {
    subAppType?: SubAppType | 10 | 11;
    subAppId?: string | undefined;
    url?: string;
  };
}

export interface baseMenuProps {
  selectedKey: string;
  dataSource: Menu[];
  children: React.ReactNode;
}

export interface MenuComponentProps extends baseMenuProps {
  extra: React.ReactNode;
  theme: ThemeType;
}

export interface NavMenuComponentProps extends baseMenuProps {
  navMode: NavModeType;
}

export interface WorkspaceMenuProps {
  navMode: NavModeType;
  dataSource: Menu[];
}

export interface WorkspaceBaseMenuProps {
  extra: React.ReactNode;
  dataSource: Menu[];
  theme: ThemeType;
  selectedKey: string;
}

export declare type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E;
      data?: undefined;
      meta?: M;
      resultCode?: undefined;
      resultMessage?: undefined;
    }
  | {
      error?: undefined;
      data: T;
      meta?: M;
      resultCode?: undefined;
      resultMessage?: undefined;
    };

export type GroupItem = { name: string; id: number };

export interface GroupListProps {
  groupList: GroupItem[];
}

export type TableColumnsProps = {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
  openVisit: boolean;
  group: { id: number; name: string };
  public: boolean;
};

export type CardOptionProps = {
  type: { [key in string]: string };
  fieldList: any[];
  onDelete?: (item: any) => void;
  onEdit?: (e: React.MouseEvent, item: any) => void;
  onConfirm?: (v: any) => void;
  onSelect?: (v: any) => void;
  onRevert?: () => void;
  setShowDropdown?: (v: boolean) => void;
};
