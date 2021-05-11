import { FieldType } from '@/type';
export { localStorage } from './localstorage';
export { default as axios } from './axios';
export { default as history } from './history';

export function getToolboxImageUrl(icon: string): string {
  const publicPath = process.env.PUBLIC_URL;
  return `${publicPath}/images/toolbox/${icon}.png`;
}
