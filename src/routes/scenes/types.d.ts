import { SCENE_IAMGES } from '@consts';

export interface ProjectShape {
  name: string;
  id: number;
  sceneCount: number;
}

export type ActionStatus = 'editing' | 'deleting' | undefined;

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
