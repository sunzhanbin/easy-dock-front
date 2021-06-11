export { default as axios, runtimeAxios, builderAxios } from './axios';
export { default as history } from './history';

export function getToolboxImageUrl(icon: string): string {
  const publicPath = process.env.PUBLIC_URL;
  return `${publicPath}/images/toolbox/${icon}.png`;
}
