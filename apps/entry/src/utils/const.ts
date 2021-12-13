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

export const CREATE_DATA_LIST = [
  {
    icon: "icon_shebei",
    text: "接入设备",
    linkName: "设备",
  },
  {
    icon: "icon_shuju",
    text: "接入数据",
    linkName: "数据",
  },
  {
    icon: "icon_shujumoxing",
    text: "新建数据模型",
    linkName: "数据模型",
  },
];

export const CREATE_BUSINESS_LIST = [
  {
    icon: "icon_newform",
    text: "新建表单",
    linkName: "表单",
  },
  {
    icon: "icon_newflow",
    text: "新建流程",
    linkName: "流程",
  },
  {
    icon: "icon_newinterface",
    text: "新建接口",
    linkName: "接口",
  },
];

export const CREATE_VIRTUAL_LIST = [
  {
    icon: "icon_newchart",
    text: "新建报表",
    linkName: "报表",
  },
  {
    icon: "icon_newcanvas",
    text: "新建大屏",
    linkName: "大屏",
  },
  {
    icon: "icon_newspace",
    text: "新建空间",
    linkName: "空间",
  },
];

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
];

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

// 请输入1-30位的汉字、字母、数字、下划线
export const nameRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/;
