const components = {
  data: [
    {
      version: '1.0',
      title: '',
      desc: '',
      required: false,
      colSpace: 4,
      defaultValue: '',
      disabled: false,
      value: '',
      editable: true,
      readonly: false,
      visible: true,
      placeholder: '',
      maxLength: 10000,
      allowClear: true,
      bordered: true,
      type: 'Input',
      prefix: '',
      suffix: '',
      reg: '',
      schema: [
        {
          key: 'title',
          label: '标题',
          type: 'Input',
          direction: 'vertical',
        },
        {
          key: 'editable',
          label: '可编辑',
          type: 'Checkbox',
          direction: 'horizontal',
        },
      ],
    },
    {
      version: '1.0',
      title: '',
      desc: '',
      required: false,
      colSpace: 4,
      defaultValue: '',
      disabled: false,
      value: '',
      editable: true,
      readonly: false,
      visible: true,
      datasource: null,
      dataFilter: [
        {
          operator: '=',
          children: [
            {
              type: 'field',
              value: 'field id',
            },
            {
              type: 'constant',
              value: 5,
            },
          ],
        },
      ],
      formLogic: {
        visible: [
          {
            option: ['option1'],
            fields: ['fieldId1', 'fieldId2'],
          },
        ],
        disable: [
          {
            option: ['option1'],
            fields: ['fieldId1', 'fieldId2'],
          },
        ],
        refresh: [
          {
            option: ['option1'],
            fields: ['fieldId1', 'fieldId2'],
          },
        ],
        reset: [
          {
            option: ['option1'],
            fields: ['fieldId1', 'fieldId2'],
          },
        ],
      },
      schema: [
        {
          key: 'title',
          label: '标题',
          type: 'Input',
          direction: 'vertical',
        },
        {
          key: 'editable',
          label: '可编辑',
          type: 'Checkbox',
          direction: 'horizontal',
        },
      ],
    },
  ],
};

export default components;
