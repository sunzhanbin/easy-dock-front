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
  menu: Menu[];
  menuForm: MenuSetupForm;
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
  showMenu: boolean;
  icon: string;
  mode: "blank" | "current";
  isHome: boolean;
  asset: "exist" | "custom";
  assetConfig: {
    app?: string;
    subapp?: string;
    url?: string;
  };
}

export interface MenuComponentProps {
  extra: React.ReactNode;
  selectedKey: string;
  dataSource: Menu[];
  children: React.ReactNode;
}

export interface NavMenuComponentProps extends MenuComponentProps {
  navMode: "single" | "multi";
}
