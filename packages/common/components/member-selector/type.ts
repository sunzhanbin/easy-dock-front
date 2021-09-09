import { Member, Dept, Role } from '../../type';

export type { Member, Dept, Role } from '../../type';

export type ValueType = {
  members: Member[];
  depts: Dept[];
  roles: Role[];
};

export type Key = string | number;

export type TreeData = {
  title: string;
  key: Key;
  children?: TreeData;
}[];
