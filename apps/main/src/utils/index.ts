import { SCENE_IAMGES } from '@consts';
export { default as axios, builderAxios, runtimeAxios } from './axios';
export { default as history } from './history';

export function getSceneImageUrl(type: keyof typeof SCENE_IAMGES) {
  const publicPath = process.env.PUBLIC_URL;

  return `${publicPath}/images/scenes/${SCENE_IAMGES[type || 'scene1']}.png`;
}

// 文字超出9个显示...
export function getShorterText(text: string) {
  return text.length > 8 ? text.slice(0, 8) + '...' : text;
}
