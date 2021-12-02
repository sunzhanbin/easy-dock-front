import { SCENE_IAMGES } from "@utils/const";

export interface workspaceShape {
  name: string;
  id: number;
  status: -1 | 1;
  icon: keyof typeof SCENE_IAMGES;
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

export interface AppManagerState {
  value: number;
  projectId: number;
  currentWorkspaceId: number;
  status: "idle" | "loading" | "failed";
  currentWorkspace: workspaceShape;
  workspaces: workspaceShape[];
  subApps: SubAppInfo[];
}

export interface BasicSetupInitialState {
  theme: string;
  navMode: "single" | "multi";
  logo: { [key: string]: any };
  basicForm: { [key: string]: any };
}

export interface MenuSetupInitialState {
  currentId: string;
  menu: any[];
  menuForm: { [key: string]: any };
}

export interface Menu {
  depth: number;
  children: Menu[];
  form: { [key: string]: any };
  id: string;
  name: string;
  parentId: string | null;
}
