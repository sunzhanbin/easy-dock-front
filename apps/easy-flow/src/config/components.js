const componentSchema = {
  Input: {
    baseInfo: {
      name: '单行文本',
      icon: 'icondanhangwenben',
      category: '基础控件',
      version: '1.0',
      type: 'Input',
    },
    config: [
      {
        key: 'fieldName',
        defaultValue: '',
        label: '数据库字段名',
        placeholder: '字母开头,数字或下划线组成',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'label',
        defaultValue: '单行文本',
        label: '控件名称',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'tip',
        defaultValue: '',
        label: '提示语',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'isUniq',
        defaultValue: false,
        label: '是否唯一',
        type: 'Switch',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ],
  },
  Textarea: {
    baseInfo: {
      name: '多行文本',
      icon: 'iconduohangcaidan',
      category: '基础控件',
      version: '1.0',
      type: 'Textarea',
    },
    config: [
      {
        key: 'fieldName',
        defaultValue: '',
        label: '数据库字段名',
        placeholder: '字母开头,数字或下划线组成',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'label',
        defaultValue: '多行文本',
        label: '控件名称',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'tip',
        defaultValue: '',
        label: '提示语',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        placeholder: '请输入',
        type: 'Textarea',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ]
  },
  Select: {
    baseInfo: {
      name: '下拉框',
      icon: 'iconxialakuang',
      category: '基础控件',
      version: '1.0',
      type: 'Select',
    },
    config: [
      {
        key: 'fieldName',
        defaultValue: '',
        label: '数据库字段名',
        placeholder: '字母开头,数字或下划线组成',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'label',
        defaultValue: '下拉框',
        label: '控件名称',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'tip',
        defaultValue: '',
        label: '提示语',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        placeholder: '请选择',
        type: 'SelectDefaultOption',
        direction: 'vertical',
      },
      {
        key: 'multiple',
        defaultValue: false,
        label: '是否多选',
        type: 'Switch',
        direction: 'horizontal',
      },
      {
        key: 'showSearch',
        defaultValue: false,
        label: '是否可搜索',
        type: 'Switch',
        direction: 'horizontal',
      },
      {
        key: 'selectOptionList',
        defaultValue: {
          type: 'custom',
          content: [
            { key: '选项一', value: '选项一' },
            { key: '选项二', value: '选项二' },
            { key: '选项三', value: '选项三' },
          ],
        },
        label: '选项内容',
        type: 'SelectOptionList',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ],
  },
  Date: {
    baseInfo: {
      name: '日期',
      icon: 'iconriqi',
      category: '基础控件',
      version: '1.0',
      type: 'Date',
    },
    config: [
      {
        key: 'fieldName',
        defaultValue: '',
        label: '数据库字段名',
        placeholder: '字母开头,数字或下划线组成',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'label',
        defaultValue: '日期',
        label: '控件名称',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'tip',
        defaultValue: '',
        label: '提示语',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'format',
        defaultValue: '1',
        label: '显示格式',
        placeholder: '请选择',
        type: 'Select',
        direction: 'vertical',
        range: [
          {
            key: '1',
            value: '年-月-日'
          },
          {
            key: '2',
            value: '年-月-日 时:分:秒'
          },
        ]
      },
      {
        key: 'notSelectPassed',
        defaultValue: false,
        label: '禁止选择已过去的时间',
        type: 'Switch',
        direction: 'horizontal',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        placeholder: '选择日期',
        type: 'DefaultDate',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ]
  },
  InputNumber: {
    baseInfo: {
      name: '数字',
      icon: 'iconshuzi123',
      category: '基础控件',
      version: '1.0',
      type: 'InputNumber',
    },
    config: [
      {
        key: 'fieldName',
        defaultValue: '',
        label: '数据库字段名',
        placeholder: '字母开头,数字或下划线组成',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'label',
        defaultValue: '数字',
        label: '控件名称',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'tip',
        defaultValue: '',
        label: '提示语',
        placeholder: '请输入',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        placeholder: '请输入',
        type: 'InputNumber',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ]
  },
  DescText: {
    baseInfo: {
      name: '描述文字',
      icon: 'iconxiangqing',
      category: '基础控件',
      version: '1.0',
      type: 'DescText',
    },
    config: [
      {
        key: 'content',
        defaultValue: '',
        label: '内容',
        type: 'Editor',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '控件宽度',
        type: 'ColSpace',
        direction: 'vertical',
      },
    ]
  }
};

export default componentSchema;
