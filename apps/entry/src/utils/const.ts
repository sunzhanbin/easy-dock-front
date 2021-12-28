import { HomeSubAppType } from "@/consts";

export const RouteMap = {
  1: "canvas",
  2: "flow",
  3: "chart",
  4: "space",
  5: "form",
  10: "task-center",
};

export const NavMenu = [
  {
    name: "开始",
    route: "/",
  },
  {
    name: "资产中心",
    route: "/app-manager",
  },
  {
    name: "应用管理",
    route: "/app-manager",
  },
  {
    name: "模板商城",
    route: "/template-mall",
  },
];

export const SCENE_IAMGES = {
  scene1: `scene1`,
  scene2: `scene2`,
  scene3: `scene3`,
  scene4: `scene4`,
  scene5: `scene5`,
  scene6: `scene6`,
  scene7: `scene7`,
  scene8: `scene8`,
  scene9: `scene9`,
  scene10: `scene10`,
  scene11: `scene11`,
  scene12: `scene12`,
};

/* -------home start ----------*/
import DeviceImage from "@assets/images/device.png";
import DataImage from "@assets/images/data-join.png";
import DataFishImage from "@assets/images/data-model.png";
import InterfaceImage from "@assets/images/interface.png";
import CanvasImage from "@assets/images/canvas.png";
import ChartImage from "@assets/images/chart.png";
import FormImage from "@assets/images/form.png";
import FlowImage from "@assets/images/flow.png";
import SpaceImage from "@assets/images/space.png";
import TaskImage from "@assets/images/home/no-app.png";

export const ImageMap: { [k: number]: string } = {
  [HomeSubAppType.CANVAS]: CanvasImage,
  [HomeSubAppType.CHART]: ChartImage,
  [HomeSubAppType.FORM]: FormImage,
  [HomeSubAppType.FLOW]: FlowImage,
  [HomeSubAppType.SPACE]: SpaceImage,
  [HomeSubAppType.DEVICE]: DeviceImage,
  [HomeSubAppType.DATA]: DataImage,
  [HomeSubAppType.DATA_FISH]: DataFishImage,
  [HomeSubAppType.INTERFACE]: InterfaceImage,
  [HomeSubAppType.TASK_CENTER]: TaskImage,
};

export const NameMap: { [k: number]: string } = {
  [HomeSubAppType.CANVAS]: "大屏",
  [HomeSubAppType.CHART]: "报表",
  [HomeSubAppType.FORM]: "表单",
  [HomeSubAppType.FLOW]: "流程",
  [HomeSubAppType.SPACE]: "空间",
  [HomeSubAppType.DEVICE]: "设备",
  [HomeSubAppType.DATA]: "数据",
  [HomeSubAppType.DATA_FISH]: "模型",
  [HomeSubAppType.INTERFACE]: "接口",
  [HomeSubAppType.TASK_CENTER]: "默认",
};

export const TASK_CENTER_TYPE = 10;

// 数据构建
const CREATE_DATA_LIST = [
  {
    type: HomeSubAppType.DEVICE,
    icon: "icon_shebei",
    text: "接入设备",
    linkName: "设备",
  },
  {
    type: HomeSubAppType.DATA,
    icon: "icon_shuju",
    text: "接入数据",
    linkName: "数据",
  },
  {
    type: HomeSubAppType.DATA_FISH,
    icon: "icon_shujumoxing",
    text: "新建模型",
    linkName: "数据模型",
  },
];

// 业务构建
const CREATE_BUSINESS_LIST = [
  {
    type: HomeSubAppType.FORM,
    icon: "icon_newform",
    text: "新建表单",
    linkName: "表单",
  },
  {
    type: HomeSubAppType.FLOW,
    icon: "icon_newflow",
    text: "新建流程",
    linkName: "流程",
  },
  {
    type: HomeSubAppType.INTERFACE,
    icon: "icon_newinterface",
    text: "新建接口",
    linkName: "接口",
  },
];

// 可视化构建
const CREATE_VIRTUAL_LIST = [
  {
    type: HomeSubAppType.CHART,
    icon: "icon_newchart",
    text: "新建报表",
    linkName: "报表",
  },
  {
    type: HomeSubAppType.CANVAS,
    icon: "icon_newcanvas",
    text: "新建大屏",
    linkName: "大屏",
  },
  {
    type: HomeSubAppType.SPACE,
    icon: "icon_newspace",
    text: "新建空间",
    linkName: "空间",
  },
];

// 数据资产
export const ASSETS_DATA_LIST = [
  {
    name: "接口数",
    num: 207,
  },
  {
    name: "数据数",
    num: 0,
  },
  {
    name: "模型数",
    num: 51,
  },
];

// 帮助文档
export const HELP_LIST = [
  {
    name: "平台说明",
    desc:
      "平台主要由登录页、构建端和运行端组成，其中构建端由项目页、应用页、表单构建页、流程构建页、权限配置页、扩展设置页组成；运行端由任务中心页、流程数据管理页、流程详情页、任务详情页等组成",
  },
  {
    name: "表单编排",
    desc:
      "表单编排页面包括展示内容包括三个部分，分别左侧为控件展示区域、中间为画布区域、右侧为属性及规则配置区域",
  },
  {
    name: "流程编排",
    desc:
      "流程编排页面包括展示内容包括两个部分，分别左侧为画布区域、右侧为节点属性配置区域",
  },
  {
    name: "任务中心",
    desc: "任务中心展示该用户的待办任务、发起流程、已办任务、抄送、草稿等",
  },
  {
    name: "接口编排",
    desc:
      "自定义服务积木，使用第三方API服务，该API服务未导入到系统中，该积木会根据指定的Url、请求类型及请求参数，调用该API，返回调用该API的响应结果",
  },
  {
    name: "报表编排",
    desc:
      "报表编排包括仪表盘、统计图表、数据接入、数据规则共四个模块，顶部提供各类统计图表，中间画布支持自由布局，点击图表进行数据源选择及规则配置",
  },
  {
    name: "大屏编排",
    desc:
      "画布编辑、发布和数据源对接能力，需进行页面名称填写并设置分组，同时可以选择某个模板作为当前的编辑页面或者选择空白页作为当前页面",
  },
  {
    name: "接入数据",
    desc:
      "模型组件用于对左侧源数据进行数据治理，通过组件自由组合实现，数据的灵活治理，包括结果输出、单表操作、多表操作",
  },
];

// 应用构建列表
export const SUB_APP_LIST = [
  {
    name: "数据构建",
    desc: "轻松融合海量数据，优化、清晰、 有序",
    className: "create_data",
    subList: CREATE_DATA_LIST,
  },
  {
    name: "业务构建",
    desc: "无码化搭建，快速完成业务信息化",
    className: "create_business",
    subList: CREATE_BUSINESS_LIST,
  },
  {
    name: "可视化构建",
    desc: "多角度呈现可视化数据，极速搭建页面",
    className: "create_virtual",
    subList: CREATE_VIRTUAL_LIST,
  },
];

export const NOT_SHOW_MODAL_SELECT = [
  HomeSubAppType.DATA,
  HomeSubAppType.DATA_FISH,
  HomeSubAppType.DEVICE,
  HomeSubAppType.INTERFACE,
];

/* -------home end ----------*/

// 请输入1-30位的汉字、字母、数字、下划线
export const nameRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/;
