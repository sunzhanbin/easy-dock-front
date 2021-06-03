import { mock } from 'mockjs';
import { FillNode, AuditNode, AuthType, NodeType, NodeStatusType } from '@type/flow';
import { FlowDetaiDataType } from './type';

const database: any = {
  subApp: {},
  flowDesign: {},
  formDesign: {
    selectedTheme: 'themeId',
    components: [
      {
        id: 'Input_1',
        version: '1.0',
        type: 'Input',
        title: '姓名',
        desc: '姓名',
        defaultValue: '',
        placeholder: '请输入姓名',
        colSpace: 1,
        unique: true,
        datasource: null,
      },
      {
        id: 'Input_2',
        version: '1.0',
        type: 'Input',
        title: '联系地址',
        desc: '联系地址',
        defaultValue: '',
        placeholder: '请输入联系地址',
        colSpace: 4,
        datasource: null,
      },
      {
        id: 'Select_1',
        version: '1.0',
        type: 'Select',
        title: '性别',
        desc: '性别',
        defaultValue: 'male',
        colSpace: 3,
        datasource: {
          type: 'custom',
          data: [
            {
              value: 'male',
              name: '男',
            },
            {
              value: 'female',
              name: '女',
            },
          ],
        },
      },
      {
        id: 'Select_2',
        version: '1.0',
        type: 'Select',
        title: '性别',
        desc: '性别',
        defaultValue: 'male',
        colSpace: 4,
        value: 'male',
        datasource: {
          type: 'app',
          appId: 'subapp1',
          fieldId: 'Input_1',
        },
      },
    ],
    layout: [['Input_1', 'Select_1'], ['Input_2'], ['Select_2']],
    events: {
      onchange: [
        {
          fieldId: 'Input_2',
          value: 'male',
          listeners: {
            visible: ['Input_1', 'Select_2'],
            reset: ['Select_1'],
          },
        },
      ],
    },
    schema: {
      Input: {
        baseInfo: {
          name: '单行文本',
          icon: 'logo-icon',
          category: '基础组件',
          version: '1.0',
          type: 'Input',
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
      Select: {
        baseInfo: {
          name: '下拉列表',
          icon: 'logo-icon',
          category: '基础组件',
          version: '1.0',
          type: 'Select',
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
    },
    rules: [
      {
        type: 'reg',
        field: 'Input_1',
        validator: /(.+)$/,
        message: '输入不合法',
      },
      {
        type: '<',
        field: 'Input_1',
        validator: { type: 'ref', value: 'Input_2' },
        message: 'Input_1不能<Input_2',
      },
      {
        type: '||',
        field: 'Input_1',
        children: [
          {
            type: 'reg',
            field: 'Input_1',
            validator: /(.+)$/,
          },
          {
            type: '<',
            field: 'Input_1',
            validator: { type: 'ref', value: 'Input_2' },
          },
        ],
        message: '输入不满足条件',
      },
    ],
    themes: [{}],
  },
};

const startFilleNode = <FillNode>{
  type: NodeType.FillNode,
  correlationMemberConfig: {
    members: [],
  },
  name: '填写节点',
  id: 'ddddd',
  btnText: {
    submit: {
      text: '速速提交',
      enable: true,
    },
    save: {
      text: '速度保存',
    },
  },
  fieldsAuths: {
    Input_1: AuthType.View,
    Input_2: AuthType.Edit,
  },
};

mock(/\/flow\/detail\/\S+/, 'get', function name(options: MockOptions) {
  return {
    resultCode: 0,
    data: {
      processMeta: startFilleNode,
      formMeta: database.formDesign,
      formData: {
        Input_1: '这是...',
        Input_2: '第二个输入',
        Select_1: '只读',
      },
    },
  };
});

mock(/\/runtime\/v1\/task\/instanceDetail/, 'post', function name(options: MockOptions) {
  const slices = options.url.split('/');
  const appkey = slices[slices.length - 1];

  return {
    resultCode: 0,
    data: <FlowDetaiDataType>{
      auditRecords: [],
      formData: {},
      formMeta: database.formDesign,
      detail: {
        state: NodeStatusType.Processing,
        timeUsed: '1天1小时12分钟3秒',
        currentProcessor: {
          users: [
            { name: '张三', id: '1', avatar: '' },
            { name: '李四', id: '2', avatar: '' },
            { name: '王二麻子221212122121212ddd', id: '3', avatar: '' },
          ],
          groups: [],
        },
      },
      processMeta: <AuditNode>{
        id: 'flow-node-8ckew2qjeo3-ia0q73ry1h8-b4ci6vmcva',
        type: 2,
        fieldsAuths: {
          Select_1: 1,
          Select_2: 2,
          Input_1: 1,
          Input_2: 1,
        },
        name: '审批节点',
        correlationMemberConfig: {
          members: ['www66', 'wanjiang', 'zhuxiangwei'],
        },
        btnText: {
          approve: {
            enable: true,
          },
          revert: {
            enable: true,
          },
          save: {
            enable: true,
          },
        },
        revert: {
          type: 1,
        },
      },
    },
  };
});

mock(/\/form\/value\/\S+/, 'get', function name(options: MockOptions) {
  const slices = options.url.split('/');
  const appkey = slices[slices.length - 1];

  return {
    resultCode: 0,
    data: {
      Input_1: 'hello',
      Input_2: 'male',
    },
  };
});
