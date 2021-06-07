import { SCENE_IAMGES } from '@consts';

export interface ProjectShape {
  name: string;
  id: number;
  appCount: number;
}

export interface SceneShape {
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
