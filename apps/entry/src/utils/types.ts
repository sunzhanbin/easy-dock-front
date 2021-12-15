import { NavModeType, SubAppType, ThemeType } from "@/consts";
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
  theme: ThemeType;
  navMode: NavModeType;
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
  navMode: NavModeType;
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
}
