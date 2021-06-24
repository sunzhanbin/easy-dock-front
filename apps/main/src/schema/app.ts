import { SCENE_IAMGES } from '@consts';

export type AppSchema = {
  id: number;
  name: string;
  icon: keyof typeof SCENE_IAMGES;
  remark: string;
  status: 1 | -1;
  createTime: number;
};
