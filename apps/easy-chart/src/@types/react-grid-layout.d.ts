import { Layout } from 'react-grid-layout';

declare module 'react-grid-layout' {
  export interface ItemType extends Layout {
    datasource:number[]
  }
}
