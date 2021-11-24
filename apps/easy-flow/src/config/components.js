const fieldName = {
  key: 'fieldName',
  defaultValue: '',
  label: '数据库字段名',
  placeholder: '字母开头,数字或下划线组成',
  type: 'Input',
  direction: 'vertical',
  required: true,
  requiredMessage: '请输入数据库字段名',
  rules: [{ pattern: '^[a-zA-Z][a-zA-Z0-9_]{0,29}$', message: '请输入字母开头，包含字母、数字、下划线的1-30位字符' }],
  isProps: false,
};
const getLabel = (defaultValue) => {
  return {
    key: 'label',
    label: '控件名称',
    placeholder: '请输入',
    type: 'Input',
    direction: 'vertical',
    required: true,
    requiredMessage: '请输入控件名称',
    isProps: false,
    defaultValue,
  };
};
const desc = {
  key: 'desc',
  defaultValue: '',
  label: '提示语',
  placeholder: '请输入',
  type: 'Input',
  direction: 'vertical',
  required: false,
  isProps: false,
};
const getDefaultValue = (type, placeholder = '请输入') => {
  return {
    key: 'defaultValue',
    defaultValue: '',
    label: '默认值',
    direction: 'vertical',
    required: false,
    isProps: true,
    placeholder,
    type,
  };
};
const colSpace = {
  key: 'colSpace',
  defaultValue: '4',
  label: '控件宽度',
  type: 'ColSpace',
  direction: 'vertical',
  required: false,
  isProps: false,
};
const unique = {
  key: 'unique',
  defaultValue: false,
  label: '不允许重复值',
  type: 'Switch',
  direction: 'vertical',
  required: false,
  isProps: false,
};
const multiple = {
  key: 'multiple',
  defaultValue: false,
  label: '是否多选',
  type: 'Switch',
  direction: 'horizontal',
  required: false,
  isProps: true,
};
const showSearch = {
  key: 'showSearch',
  defaultValue: false,
  label: '是否可搜索',
  type: 'Switch',
  direction: 'horizontal',
  required: false,
  isProps: true,
};

export const dataSource = {
  key: 'dataSource',
  defaultValue: {
    type: 'custom',
    data: [
      { key: '选项1', value: '选项1' },
      { key: '选项2', value: '选项2' },
      { key: '选项3', value: '选项3' },
    ],
  },
  label: '选项内容',
  type: 'SelectOptionList',
  direction: 'vertical',
  required: true,
  isProps: false,
};
const flows = {
  key: 'flows',
  label: 'flowsData',
  defaultValue: {
    data: [
      { key: 'key1', value: '字段1' },
      { key: 'key2', value: '字段2' },
      { key: 'key3', value: '字段3' },
    ],
  },
  type: 'selectColumns',
  direction: 'vertical',
  required: true,
  isProps: false,
};

// 编号规则
const serialRule = {
  key: 'serialRule',
  label: '编号规则',
  defaultValue: {
    serialId: '',
    serialMata: {
      rules: [
        {
          digitsNum: 5,
          startValue: 1,
          resetDuration: 'none',
          type: 'incNumber',
        },
      ],
    },
  },
  type: 'serialRules',
  direction: 'vertical',
  required: false,
  isProps: false,
};

const format = {
  key: 'format',
  defaultValue: 'YYYY-MM-DD',
  label: '显示格式',
  placeholder: '请选择',
  type: 'Select',
  direction: 'vertical',
  range: [
    {
      key: 'YYYY-MM-DD',
      value: '年-月-日',
    },
    {
      key: 'YYYY-MM-DD HH:mm:ss',
      value: '年-月-日 时:分:秒',
    },
  ],
  required: false,
  isProps: true,
};
const descTextValue = {
  key: 'value',
  defaultValue: '',
  label: '内容',
  type: 'Editor',
  direction: 'vertical',
  required: true,
  isProps: false,
};

const getMaxCount = (max, min, defaultValue) => {
  return {
    key: 'maxCount',
    label: `最大上传数(正整数且最大为${max})`,
    placeholder: '请输入',
    type: 'InputNumber',
    direction: 'vertical',
    required: false,
    isProps: true,
    precision: 0,
    defaultValue,
    max,
    min,
  };
};

const fieldManage = {
  key: 'components',
  label: '子控件',
  type: 'FieldManage',
  required: false,
  isProps: true,
};

const numberOption = {
  key: 'defaultNumber',
  label: '默认值',
  defaultValue: {
    type: 'custom',
    data: '',
  },
  type: 'NumberOption',
  direction: 'vertical',
  required: false,
  isProps: false,
};

const allowDecimal = {
  key: 'decimal',
  label: '允许小数',
  defaultValue: {
    enable: false,
  },
  type: 'allowDecimal',
  required: false,
  isProps: true,
};

const decimalCount = {
  key: 'precision',
  defaultValue: 1,
  type: 'precision',
  required: false,
  isProps: true,
};
const limitNum = {
  key: 'numlimit',
  label: '限制数值范围',
  defaultValue: false,
  type: 'limitNum',
  required: false,
  isProps: true,
};

const rangeNum = {
  key: 'numrange',
  defaultValue: {
    min: 0,
    max: 0,
  },
  type: 'numrange',
  required: false,
  isProps: true,
};

const limitDate = {
  key: 'datelimit',
  label: '限制日期范围',
  defaultValue: false,
  type: 'limitDate',
  required: false,
  isProps: true,
};

const rangeDate = {
  key: 'daterange',
  defaultValue: {
    min: 0,
    max: 0,
  },
  type: 'daterange',
  required: false,
  isProps: true,
};

// 限制文件类型
const files = {
  key: 'typeRestrict',
  label: '限制文件类型',
  defaultValue: false,
  type: 'files',
  required: false,
  isProps: true,
};

const filetype = {
  key: 'filetype',
  defaultValue: {},
  type: 'filetype',
  required: false,
  isProps: true,
};

const components = {
  Input: {
    baseInfo: {
      name: '单行文本',
      icon: 'danhangwenben',
      category: '基础控件',
      version: '1.0',
      type: 'Input',
    },
    config: [fieldName, getLabel('单行文本'), desc, getDefaultValue('Input'), unique, colSpace],
  },
  Textarea: {
    baseInfo: {
      name: '多行文本',
      icon: 'duohangcaidan',
      category: '基础控件',
      version: '1.0',
      type: 'Textarea',
    },
    config: [fieldName, getLabel('多行文本'), desc, getDefaultValue('Textarea'), colSpace],
  },
  Select: {
    baseInfo: {
      name: '下拉框',
      icon: 'xialakuang',
      category: '基础控件',
      version: '1.0',
      type: 'Select',
    },
    config: [fieldName, getLabel('下拉框'), desc, multiple, showSearch, dataSource, colSpace],
  },
  Radio: {
    baseInfo: {
      name: '单选',
      icon: 'danxuankuang',
      category: '基础控件',
      version: '1.0',
      type: 'Radio',
    },
    config: [fieldName, getLabel('单选框'), desc, dataSource, colSpace],
  },
  Checkbox: {
    baseInfo: {
      name: '复选',
      icon: 'duoxuankuang',
      category: '基础控件',
      version: '1.0',
      type: 'Checkbox',
    },
    config: [fieldName, getLabel('复选框'), desc, dataSource, colSpace],
  },
  Date: {
    baseInfo: {
      name: '日期',
      icon: 'riqi',
      category: '基础控件',
      version: '1.0',
      type: 'Date',
    },
    config: [
      fieldName,
      getLabel('日期'),
      desc,
      format,
      getDefaultValue('DefaultDate', '选择日期'),
      limitDate,
      rangeDate,
      colSpace,
    ],
  },
  InputNumber: {
    baseInfo: {
      name: '数字',
      icon: 'shuzi123',
      category: '基础控件',
      version: '1.0',
      type: 'InputNumber',
    },
    config: [fieldName, getLabel('数字'), desc, numberOption, allowDecimal, decimalCount, limitNum, rangeNum, colSpace],
  },
  DescText: {
    baseInfo: {
      name: '描述文字',
      icon: 'xiangqing',
      category: '基础控件',
      version: '1.0',
      type: 'DescText',
    },
    config: [getLabel('描述文字'), descTextValue, colSpace],
  },
  Tabs: {
    baseInfo: {
      name: '标签页 ',
      icon: 'tabcaise',
      category: '基础控件',
      version: '1.0',
      type: 'Tabs',
    },
    config: [fieldName, getLabel('标签页 '), desc, fieldManage],
  },
  Image: {
    baseInfo: {
      name: '图片',
      icon: 'tupiancaidan',
      category: '基础控件',
      version: '1.0',
      type: 'Image',
    },
    config: [fieldName, getLabel('图片'), desc, getMaxCount(10, 1, 10), colSpace],
  },
  Attachment: {
    baseInfo: {
      name: '附件',
      icon: 'fujiancaidan',
      category: '基础控件',
      version: '1.0',
      type: 'Attachment',
    },
    config: [fieldName, getLabel('附件'), desc, getMaxCount(5, 1, 5), files, filetype, colSpace],
  },
  SerialNum: {
    baseInfo: {
      name: '编号',
      icon: 'bianhaocaise',
      category: '基础控件',
      version: '1.0',
      type: 'SerialNum',
    },
    config: [fieldName, getLabel('编号'), desc, serialRule, colSpace],
  },
  Member: {
    baseInfo: {
      name: '人员',
      icon: 'jibenxinxi',
      category: '高级控件',
      version: '1.0',
      type: 'Member',
    },
    config: [fieldName, getLabel('人员'), desc, multiple, showSearch, colSpace],
  },
  FlowData: {
    baseInfo: {
      name: '关联流程',
      icon: 'liuchengcaise',
      category: '高级控件',
      version: '1.0',
      type: 'FlowData',
    },
    config: [fieldName, getLabel('关联流程'), flows, colSpace],
  },
};

export default components;
