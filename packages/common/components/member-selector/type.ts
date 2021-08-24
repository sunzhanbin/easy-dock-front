import { User, Dept, Role } from '../../type';

export type { User, Dept, Role } from '../../type';

export type ValueType = {
  members: User[];
  depts: Dept[];
  roles: Role[];
};

export type Key = string | number;

export type TreeData = {
  title: string;
  key: Key;
  children?: TreeData;
}[];
