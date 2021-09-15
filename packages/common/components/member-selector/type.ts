import { Member, Dept, Role } from '../../type';

export type { Member, Dept, Role } from '../../type';

export type Key = string | number;

export type ValueType = {
  members: Member[];
  depts: Dept[];
  roles: Role[];
  dynamic?: {
    starter?: boolean;
    roles: Role[];
    fields: { name: string; key: Key }[];
  };
};

export type TreeData = {
  title: string;
  key: Key;
  children?: TreeData;
}[];

export type DynamicFields = { name: string; key: string }[];
