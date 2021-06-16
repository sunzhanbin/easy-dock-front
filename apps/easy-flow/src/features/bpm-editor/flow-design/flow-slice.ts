import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { message } from 'antd';
import { cloneDeep, isEqual } from 'lodash';
import { builderAxios, runtimeAxios } from '@utils';
import { User } from '@type';
import {
  AllNode,
  NodeType,
  StartNode,
  FinishNode,
  AuditNode,
  FillNode,
  TriggerType,
  Flow,
  AuthType,
  FieldAuthsMap,
  FieldTemplate,
} from '@type/flow';
import { RootState } from '@app/store';
import { fielduuid, createNode } from './util';

export type FlowType = {
  loading: boolean;
  data: Flow;
  dirty: boolean;
  invalidNodesMap: {
    [key: string]: {
      errors: string[];
      id: string;
      name: string;
    };
  };
  cacheMembers: {
    [loginName: string]: User;
  };
  fieldsTemplate: FieldTemplate[];
};

const flowInitial: FlowType = {
  loading: false,
  data: [],
  dirty: false,
  invalidNodesMap: {},
  cacheMembers: {},
  fieldsTemplate: [],
};

function flowUpdate(data: AllNode[], targetId: string, newNode: AllNode | null): AllNode[] {
  let tIndex = data.findIndex((subNode) => subNode.id === targetId);

  if (tIndex >= 0) {
    if (!newNode) {
      return data.slice(0, tIndex).concat(data.slice(tIndex + 1));
    }

    if (newNode.id === targetId) {
      return data
        .slice(0, tIndex)
        .concat(newNode)
        .concat(data.slice(tIndex + 1));
    } else {
      return data
        .slice(0, tIndex + 1)
        .concat(newNode)
        .concat(data.slice(tIndex + 1));
    }
  } else {
    return data.map((subNode) => {
      if (subNode.type === NodeType.BranchNode) {
        return {
          ...subNode,
          branches: subNode.branches.map((subBranch) => {
            return {
              ...subBranch,
              nodes: flowUpdate(subBranch.nodes, targetId, newNode),
            };
          }),
        };
      } else {
        return subNode;
      }
    });
  }
}

function valid(data: AllNode[], validRes: FlowType['invalidNodesMap']) {
  data.forEach((node) => {
    if (node.type === NodeType.BranchNode) {
      node.branches.forEach((branch) => {
        valid(branch.nodes, validRes);
      });
      return;
    }

    const errors = [];

    if (!node.name) {
      errors.push('未输入节点名称');
    }

    if (node.type === NodeType.StartNode) {
    } else if (node.type === NodeType.AuditNode) {
      if (!node.correlationMemberConfig.members.length) {
        errors.push('请选择办理人');
      }
    } else if (node.type === NodeType.FillNode) {
      if (!node.btnText || Object.keys(node.btnText).length === 0) {
        errors.push('请配置按钮');
      }

      if (!node.correlationMemberConfig.members.length) {
        errors.push('请选择办理人');
      }
    }

    if (errors.length) {
      validRes[node.id] = {
        errors,
        id: node.id,
        name: node.name,
      };
    }
  });

  return validRes;
}

function flowRecursion(flowData: Flow, callBack: (node: AllNode) => any) {
  flowData.forEach((node) => {
    if (node.type === NodeType.BranchNode) {
      node.branches.forEach((sBranch) => {
        flowRecursion(sBranch.nodes, callBack);
      });
    } else {
      callBack(node);
    }
  });
}

const flow = createSlice({
  name: 'flow',
  initialState: flowInitial,
  reducers: {
    setFieldsTemplate(state, { payload }: PayloadAction<FlowType['fieldsTemplate']>) {
      state.fieldsTemplate = payload;
    },
    setCacheMembers(state, { payload }: PayloadAction<FlowType['cacheMembers']>) {
      state.cacheMembers = {
        ...state.cacheMembers,
        ...payload,
      };
    },
    setInvalidMaps(state, { payload: validRes }: PayloadAction<FlowType['invalidNodesMap']>) {
      state.invalidNodesMap = validRes;
    },
    setDirty(state, { payload: dirty }: PayloadAction<boolean>) {
      state.dirty = dirty;
    },
    setLoading(state, { payload: loading }: PayloadAction<boolean>) {
      state.loading = loading;
    },
    setInitialFlow(state, { payload: data }: PayloadAction<Flow>) {
      state.data = data;
    },
    addNode(state, { payload }: PayloadAction<{ prevId: string; node: AuditNode | FillNode }>) {
      const { prevId, node } = payload;

      state.data = flowUpdate(state.data, prevId, node);
      state.dirty = true;
    },
    updateNode(state, { payload: node }: PayloadAction<AllNode>) {
      state.data = flowUpdate(state.data, node.id, node);
      state.dirty = true;
      state.invalidNodesMap = {
        ...state.invalidNodesMap,
        [node.id]: {
          ...state.invalidNodesMap[node.id],
          errors: [],
        },
      };
    },
    delNode(state, { payload: nodeId }: PayloadAction<string>) {
      state.data = flowUpdate(state.data, nodeId, null);
      state.dirty = true;

      delete state.invalidNodesMap[nodeId];
    },
  },
});

const flowActions = flow.actions;
export const { setLoading, updateNode, delNode, setCacheMembers, setDirty } = flow.actions;

function getFieldsTemplate(fieldsTemplate: FlowType['fieldsTemplate']) {
  return fieldsTemplate.reduce((fieldsAuths, item) => {
    fieldsAuths[item.id] = AuthType.View;

    return fieldsAuths;
  }, <FieldAuthsMap>{});
}

// 加载应用的流程，对于初始创建的应用是null
export const load = createAsyncThunk('flow/load', async (appkey: string, { dispatch }) => {
  try {
    // bpmid变化时重新拉取数据
    dispatch(setLoading(true));
    dispatch(flowActions.setInitialFlow(flowInitial.data));

    // 获取流程数据和所需字段
    let [{ data: flowResponse }, { data: fields }] = await Promise.all([
      builderAxios.get<{ meta: Flow | null }>(`/process/${appkey}`),
      builderAxios.get<{ field: string; name: string }[]>(`/form/subapp/${appkey}/components`),
    ]);

    const fieldsTemplate: FlowType['fieldsTemplate'] = fields.map((item) => ({ name: item.name, id: item.field }));
    let flowData = flowResponse.meta || [];

    if (!flowData.length) {
      // 如果没有流程就初始化一个
      const startNode: StartNode = {
        id: fielduuid(),
        type: NodeType.StartNode,
        name: '开始节点',
        trigger: {
          type: TriggerType.MANUAL,
        },
      };

      const finishNode: FinishNode = {
        id: fielduuid(),
        type: NodeType.FinishNode,
        name: '结束节点',
        notificationContent: '',
      };

      const fillNode: FillNode = createNode(NodeType.FillNode, '填写节点');

      fillNode.fieldsAuths = getFieldsTemplate(fieldsTemplate);

      flowData = [startNode, fillNode, finishNode];
    } else {
      const loginNames: Set<string> = new Set();

      flowRecursion(flowData, (node) => {
        if (node.type === NodeType.FillNode || node.type === NodeType.AuditNode) {
          (node.correlationMemberConfig.members || []).forEach((member) => {
            loginNames.add(member);

            const fieldsAuths: FieldAuthsMap = {};

            fieldsTemplate.forEach((item) => {
              if (node.fieldsAuths[item.id] !== undefined) {
                fieldsAuths[item.id] = node.fieldsAuths[item.id];
              } else {
                fieldsAuths[item.id] = AuthType.View;
              }
            });

            node.fieldsAuths = fieldsAuths;
          });
        }
      });

      // loginNames 为一组成员登录名，这样设计为了避免用户更新完头像或者名称后不在节点中更新的问题
      const userResponse = await runtimeAxios.post('/user/query/loginNames', Array.from(loginNames));
      const cacheMembers: FlowType['cacheMembers'] = {};

      userResponse.data.forEach((member: any) => {
        cacheMembers[member.loginName] = {
          name: member.userName,
          avatar: member.avatar,
          loginName: member.loginName,
        };
      });

      dispatch(flowActions.setCacheMembers(cacheMembers));
    }

    dispatch(flowActions.setFieldsTemplate(fieldsTemplate));
    dispatch(flowActions.setInitialFlow(flowData));
  } finally {
    dispatch(setLoading(false));
  }
});

export const save = createAsyncThunk<void, string, { state: RootState }>(
  'flow/save',
  async (subappId, { getState, dispatch }) => {
    const flow = getState().flow;
    const flowData = flow.data;
    const validResult: FlowType['invalidNodesMap'] = valid(flowData, {});

    if (Object.keys(validResult).length) {
      dispatch(flowActions.setInvalidMaps(validResult));

      message.error('数据填写不完整');

      return Promise.reject('数据填写不完整');
    }

    if (!flow.dirty) {
      message.success('保存成功');

      return;
    }

    try {
      dispatch(setLoading(true));

      await builderAxios.post('/process/add', { meta: flowData, subappId });

      dispatch(flowActions.setDirty(false));
      message.success('保存成功');
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const saveWithForm = createAsyncThunk<void, string, { state: RootState }>(
  'flow/save-with-form',
  async (subappId, { getState, dispatch }) => {
    try {
      const { flow, formDesign } = getState();
      const validResult: FlowType['invalidNodesMap'] = valid(flow.data, {});

      if (Object.keys(validResult).length) {
        dispatch(flowActions.setInvalidMaps(validResult));

        message.error('数据填写不完整');

        return Promise.reject('数据填写不完整');
      }

      const components = formDesign.byId;
      const fieldsTemplate: FlowType['fieldsTemplate'] = [];

      (formDesign.layout || []).forEach((row) => {
        row.forEach((componentId) => {
          const key = components[componentId].fieldName;

          if (!key) return;

          fieldsTemplate.push({
            id: components[componentId].fieldName,
            name: components[componentId].label,
          });
        });
      });

      const isNeedUpdateFieldTemplate = !isEqual(flow.fieldsTemplate, fieldsTemplate);

      // 如果不需要更新flow数据
      if (!isNeedUpdateFieldTemplate && !flow.dirty) return;

      dispatch(flowActions.setLoading(true));
      // 需要根据表单字段更新flow
      if (isNeedUpdateFieldTemplate) {
        const flowData = cloneDeep(flow.data);

        flowRecursion(flowData, function calcField(node) {
          if (node.type === NodeType.FillNode || node.type === NodeType.AuditNode) {
            const fieldsAuths: FieldAuthsMap = {};

            fieldsTemplate.forEach((field) => {
              const key = field.id;

              if (node.fieldsAuths[key] !== undefined) {
                fieldsAuths[key] = node.fieldsAuths[key];
              } else {
                fieldsAuths[key] = AuthType.View;
              }
            });

            node.fieldsAuths = fieldsAuths;
          }
        });

        await builderAxios.post('/process/add', { meta: flowData, subappId });

        dispatch(flowActions.setInitialFlow(flowData));
        dispatch(flowActions.setFieldsTemplate(fieldsTemplate));
      } else if (flow.dirty) {
        // 当前flow未保存
        await builderAxios.post('/process/add', { meta: flow.data, subappId });
      }

      dispatch(flowActions.setDirty(false));
    } finally {
      dispatch(flowActions.setLoading(false));
    }
  },
);

export const addNode = createAsyncThunk<
  void,
  { prevId: string; type: NodeType.AuditNode | NodeType.FillNode },
  { state: RootState }
>('flow/create-node', ({ prevId, type }, { getState, dispatch }) => {
  let tmpNode;

  if (type === NodeType.AuditNode) {
    tmpNode = createNode(type, '审批节点');
  } else if (type === NodeType.FillNode) {
    tmpNode = createNode(type, '填写节点');
  } else {
    throw Error('传入类型不正确');
  }

  // 给新节点设置初始字段权限
  tmpNode.fieldsAuths = getFieldsTemplate(getState().flow.fieldsTemplate);

  dispatch(
    flowActions.addNode({
      prevId,
      node: tmpNode,
    }),
  );
});

export default flow;

// 聚合form和flow, 因为flow的字段权限需要form的字段信息
export const flowDataSelector = createSelector([(state: RootState) => state.flow], (flow) => flow);
