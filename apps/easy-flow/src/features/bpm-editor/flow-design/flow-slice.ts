import { createSlice, PayloadAction, createAsyncThunk, createSelector, current } from '@reduxjs/toolkit';
import { message } from 'antd';
import { cloneDeep, isEqual } from 'lodash';
import { builderAxios, runtimeAxios } from '@utils';
import { User } from '@type';
import {
  AllNode,
  AddableNode,
  SubBranch,
  BranchNode,
  NodeType,
  StartNode,
  FinishNode,
  FillNode,
  TriggerType,
  Flow,
  AuthType,
  FieldAuthsMap,
  FieldTemplate,
} from '@type/flow';
import { store, RootState } from '@app/store';
import {
  fielduuid,
  createNode,
  flowUpdate,
  branchUpdate,
  valid,
  ValidResultType,
  findPrevNodes,
  getFieldsTemplate,
} from './util';

export type FlowType = {
  loading: boolean;
  saving: boolean;
  data: Flow;
  dirty: boolean;
  invalidNodesMap: ValidResultType;
  cacheMembers: {
    [loginName: string]: User;
  };
  fieldsTemplate: FieldTemplate[];
  choosedNode: AllNode | null | BranchNode['branches'][number];
};

const flowInitial: FlowType = {
  loading: false,
  saving: false,
  data: [],
  dirty: false,
  invalidNodesMap: {},
  cacheMembers: {},
  fieldsTemplate: [],
  choosedNode: null,
};

function flowRecursion(flowData: Flow, callBack: (node: AllNode) => void) {
  flowData.forEach((node) => {
    callBack(node);

    if (node.type === NodeType.BranchNode) {
      node.branches.forEach((sBranch) => {
        flowRecursion(sBranch.nodes, callBack);
      });
    }
  });
}

const flow = createSlice({
  name: 'flow',
  initialState: flowInitial,
  reducers: {
    setSaving(state, { payload }: PayloadAction<boolean>) {
      state.saving = payload;
    },
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
    setChoosedNode(state, { payload: data }: PayloadAction<FlowType['choosedNode']>) {
      state.choosedNode = data;
    },
    addNode(state, { payload }: PayloadAction<{ prevId: string; node: AddableNode }>) {
      const { prevId, node } = payload;

      state.data = flowUpdate(current(state.data), prevId, node as any);
      state.dirty = true;
    },
    updateNode(state, { payload: node }: PayloadAction<AllNode | SubBranch>) {
      if (node.type === NodeType.SubBranch) {
        state.data = branchUpdate(state.data, node);
      } else {
        state.data = flowUpdate(state.data, node.id, node);
      }

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
export const { setLoading, updateNode, delNode, setCacheMembers, setDirty, setSaving, setChoosedNode } = flow.actions;

// 加载应用的流程，对于初始创建的应用是null
export const load = createAsyncThunk('flow/load', async (appkey: string, { dispatch }) => {
  try {
    // bpmid变化时重新拉取数据
    dispatch(setLoading(true));
    dispatch(flowActions.setInitialFlow(flowInitial.data));

    // 获取流程数据和所需字段
    let [{ data: flowResponse }, { data: fields }] = await Promise.all([
      builderAxios.get<{ data: { meta: Flow | null } }>(`/process/${appkey}`),
      builderAxios.get<{ data: { field: string; name: string; type: string }[] }>(`/form/subapp/${appkey}/components`),
    ]);

    const fieldsTemplate: FlowType['fieldsTemplate'] = fields.map((item) => ({
      name: item.name,
      id: item.field,
      type: item.type,
    }));
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
        if (node.type === NodeType.FillNode || node.type === NodeType.AuditNode || node.type === NodeType.CCNode) {
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
        } else if (node.type === NodeType.BranchNode) {
          node.branches.forEach((branch) => {
            // TODO 删除分支条件里多余字段
            console.log(branch.conditions);
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
    dispatch(setSaving(true));

    const flow = getState().flow;
    const flowData = flow.data;
    const validResult: FlowType['invalidNodesMap'] = valid(flowData, {});

    try {
      await new Promise<void>((resolve, reject) => {
        if (Object.keys(validResult).length) {
          dispatch(flowActions.setInvalidMaps(validResult));

          message.error('数据填写不完整');

          return reject('数据填写不完整');
        } else {
          resolve();
        }
      });

      if (!flow.dirty) {
        message.success('保存成功');

        return;
      }

      dispatch(setLoading(true));

      await builderAxios.post('/process/add', { meta: flowData, subappId });

      dispatch(flowActions.setDirty(false));
      message.success('保存成功');
    } finally {
      dispatch(setLoading(false));
      dispatch(setSaving(false));
    }
  },
);

export const saveWithForm = createAsyncThunk<void, string, { state: RootState }>(
  'flow/save-with-form',
  async (subappId, { getState, dispatch }) => {
    try {
      dispatch(setSaving(true));

      const { flow, formDesign } = getState();
      const validResult: FlowType['invalidNodesMap'] = valid(flow.data, {});

      if (Object.keys(validResult).length) {
        dispatch(flowActions.setInvalidMaps(validResult));

        message.error('数据填写不完整');

        return Promise.reject('数据填写不完整');
      }

      const components = formDesign.byId;
      const fieldsTemplate: FlowType['fieldsTemplate'] = [];

      // 根据form重新计算fieldsTemplate
      (formDesign.layout || []).forEach((row) => {
        row.forEach((componentId) => {
          const key = components[componentId].fieldName;

          if (!key) return;

          fieldsTemplate.push({
            id: components[componentId].fieldName,
            name: components[componentId].label,
            type: components[componentId].type,
          });
        });
      });

      const isNeedUpdateFieldTemplate = !isEqual(flow.fieldsTemplate, fieldsTemplate);

      // 如果不需要更新flow数据
      if (!isNeedUpdateFieldTemplate && !flow.dirty) return;

      dispatch(setLoading(true));
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
      dispatch(setSaving(false));
      dispatch(setLoading(false));
    }
  },
);

export const addSubBranch = createAsyncThunk<void, BranchNode>('flow/add-subbranch', (branchNode, { dispatch }) => {
  dispatch(
    flowActions.updateNode({
      ...branchNode,
      branches: branchNode.branches.concat(createNode(NodeType.SubBranch)),
    }),
  );
});

export const delSubBranch = createAsyncThunk<void, { branchNode: BranchNode; targetId: string }>(
  'flow/del-subbranch',
  ({ branchNode, targetId }, { dispatch }) => {
    dispatch(
      flowActions.updateNode({
        ...branchNode,
        branches: branchNode.branches.filter((branch) => branch.id !== targetId),
      }),
    );
  },
);

export const addNode = createAsyncThunk<void, { prevId: string; type: AddableNode['type'] }, { state: RootState }>(
  'flow/create-node',
  ({ prevId, type }, { getState, dispatch }) => {
    let tmpNode;

    if (type === NodeType.BranchNode) {
      tmpNode = createNode(type);
    } else {
      if (type === NodeType.AuditNode) {
        tmpNode = createNode(type, '审批节点');
      } else if (type === NodeType.FillNode) {
        tmpNode = createNode(type, '填写节点');
      } else if (type === NodeType.CCNode) {
        tmpNode = createNode(type, '抄送节点');
      } else {
        throw Error('传入类型不正确');
      }

      tmpNode.fieldsAuths = getFieldsTemplate(getState().flow.fieldsTemplate);
    }

    // 给新节点设置初始字段权限

    dispatch(
      flowActions.addNode({
        prevId,
        node: tmpNode,
      }),
    );
  },
);

export default flow;

// 聚合form和flow, 因为flow的字段权限需要form的字段信息
export const flowDataSelector = createSelector([(state: RootState) => state.flow], (flow) => flow);

export const choosePrevNodesSelector = createSelector(
  (state: RootState) => state.flow.choosedNode?.id,
  (choosedNodeId) => {
    if (choosedNodeId) {
      return findPrevNodes(store.getState().flow.data, choosedNodeId, []);
    }

    return [];
  },
);
