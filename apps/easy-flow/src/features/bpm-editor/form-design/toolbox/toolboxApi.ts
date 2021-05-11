import { resolve } from 'dns';
import components from '@/config/components';
export function fetchComponents() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(components);
    }, 1000);
  });
}
