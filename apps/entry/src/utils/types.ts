import { SubAppType } from "@/consts";
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

export interface AppManagerInitialState {
  currentWorkspaceId: number;
}

export interface BasicSetupInitialState {
  theme: string;
  navMode: "single" | "multi";
  logo: { [key: string]: any };
  basicForm: { [key: string]: any };
}

export interface MenuSetupInitialState {
  currentId: string;
  menu: Menu[];
  menuForm: MenuSetupForm;
}

export interface WorkspaceInitialState {
  name: string;
  navMode: "single" | "multi";
  menu: Menu[];
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
    subAppType?: SubAppType;
    subAppId?: string;
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
}

export interface NavMenuComponentProps extends baseMenuProps {
  navMode: "single" | "multi";
}

export interface WorkspaceMenuProps {
  navMode: "single" | "multi";
  dataSource: Menu[];
}

export interface WorkspaceBaseMenuProps {
  extra: React.ReactNode;
  dataSource: Menu[];
}
