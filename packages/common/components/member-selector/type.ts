import { User, Dept } from '../../type';

export type ValueType = {
  members: User[];
  depts: Dept[];
};

export type Key = string | number;

export type TreeData = {
  title: string;
  key: string | number;
  children?: TreeData;
}[];
