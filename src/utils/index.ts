import { SCENE_IAMGES } from '@consts';
import { createBrowserHistory } from 'history';
import { ROUTES } from '@consts';

export { localStorage } from './localstorage';
export { default as axios } from './axios';

export function getSceneImageUrl(type: keyof typeof SCENE_IAMGES) {
  const publicPath = process.env.PUBLIC_URL;

  return `${publicPath}/scenes/${SCENE_IAMGES[type || 'scene1']}.png`;
}

export const history = createBrowserHistory();

export const login = function () {
  history.replace(ROUTES.LOGIN);
};
