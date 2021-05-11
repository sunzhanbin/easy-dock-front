const componentSchema = {
  Input: {
    baseInfo: {
      name: '单行文本',
      icon: 'logo-icon',
      category: '基础组件',
      version: '1.0',
    },
    config: [
      {
        key: 'title',
        defaultValue: '单行文本',
        label: '标题',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'desc',
        defaultValue: '单行文本',
        label: '标题',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'placeholder',
        defaultValue: '请输入',
        label: '占位文本',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'defaultValue',
        defaultValue: '',
        label: '默认值',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'maxLength',
        defaultValue: '无限制',
        label: '最大长度',
        type: 'Input',
        direction: 'vertical',
      },
      {
        key: 'colSpace',
        defaultValue: '4',
        label: '字段占比%',
        type: 'ColSpace',
        direction: 'vertical',
      },

      {
        key: 'required',
        defaultValue: false,
        label: '是否是必填项',
        type: 'Checkbox',
        direction: 'horizontal',
      },
      {
        key: 'disabled',
        defaultValue: false,
        label: '是否禁用',
        type: 'Checkbox',
        direction: 'horizontal',
      },
      {
        key: 'readonly',
        defaultValue: false,
        label: '是否只读',
        type: 'Checkbox',
        direction: 'horizontal',
      },
      {
        key: 'visible',
        defaultValue: true,
        label: '是否可见',
        type: 'Checkbox',
        direction: 'horizontal',
      },
      {
        key: 'allowClear',
        defaultValue: true,
        label: '是否允许清除',
        type: 'Checkbox',
        direction: 'horizontal',
      },
      {
        key: 'bordered',
        defaultValue: true,
        label: '是否带边框',
        type: 'Checkbox',
        direction: 'horizontal',
      },
    ],
  },
};

export default componentSchema;
