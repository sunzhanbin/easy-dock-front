import { SCENE_IAMGES } from '@consts';
export { localStorage } from './localstorage';
export { default as axios } from './axios';
export { default as history } from './history';

export function getSceneImageUrl(type: keyof typeof SCENE_IAMGES) {
  const publicPath = process.env.PUBLIC_URL;

  return `${publicPath}/images/scenes/${SCENE_IAMGES[type || 'scene1']}.png`;
}
