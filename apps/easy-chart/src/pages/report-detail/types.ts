// 排序规则 默认不排序
import { EQUAL_LIST } from "@utils/const";

export enum SortType {
  NotSort = 0,
  DESC = 1,
  ASC = 2,
}

// 筛选条件且或关系
export enum RelationType {
  AND = 0,
  OR = 1,
}

// 指标维度类型定义
export interface DimensionMetricsType {
  type: string, // 指标维度表单控件筛选的类型
  title: string, // 指标维度表单控件名称
  sort: SortType, // 排序类型
  fieldValue: string, // 表单控件值
  childField?: DimensionMetricsType // 表单下子控件的表单值
}

export interface Conditions {
  method: keyof typeof EQUAL_LIST, // 筛选的范围选择
  title: string, // 当前筛选组件的名称
  type: string, // 当前筛选组件的类型
  value: [] // 当前筛选的值
}

// 筛选添加类型定义
export interface FilterMap {
  conditions: Conditions[],
  relation: RelationType
}

// 移动端样式
export type MobileStyle = {
  width: number,
  height: number,
  order: number,
  visible: boolean
}

export type ComponentType = {
  isMobile: boolean,
  mobileStyle?: MobileStyle,
  id: number | string,
  type: string,
  pos: [number, number],
  width?: number,
  height?: number,
  permission: string,
  filterList?: FilterMap,
  metrics?: DimensionMetricsType[],
  xAxis?: {[ key: string ]: string},
  yAxis?: {[ key: string ]: string},
  xFields?:  {[ key: string ]: string | number | boolean}[],
  yFields?:  {[ key: string ]: string | number | boolean}[],
  data?: {[ key: string ]: string | number | boolean}[]
  dataSource?: {id: string, sourceName: string}
}

export type InitialStateType = {
  // 当前操作的图表组件
  curComponentData?: ComponentType | null,
  // 汇总的所有可视化组件
  componentList: ComponentType[]
}
