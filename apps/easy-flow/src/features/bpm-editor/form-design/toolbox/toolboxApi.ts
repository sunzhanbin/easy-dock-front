import { resolve } from 'dns';
import components from '@/config/components';
import { Schema, SchemaConfigItem } from '@type';

export function fetchComponents(): Promise<Schema> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(<Schema>components);
    }, 0);
  });
}
