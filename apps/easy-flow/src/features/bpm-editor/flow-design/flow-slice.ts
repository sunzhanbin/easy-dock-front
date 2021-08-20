import { createSlice, PayloadAction, createAsyncThunk, createSelector, current } from '@reduxjs/toolkit';
import { message } from 'antd';
import { builderAxios, runtimeAxios } from '@utils';
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
  FieldTemplate,
} from '@type/flow';
import { FormMeta } from '@type';
import { RootState } from '@app/store';
import { fielduuid, createNode, flowUpdate, branchUpdate, valid, ValidResultType, formatFieldsAuths } from './util';

export type FlowType = {
  form: FormMeta | null;
  loading: boolean;
  saving: boolean;
  data: Flow;
  dirty: boolean;
  invalidNodesMap: ValidResultType;
  cacheMembers: {
    [id: string]: { name: string; avatar?: string; id: number | string };
  };
  fieldsTemplate: FieldTemplate[];
  choosedNode: AllNode | null | BranchNode['branches'][number];
};

const flowInitial: FlowType = {
  form: null,
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
    setForm(state, { payload }: PayloadAction<FormMeta>) {
      state.form = payload;
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
    let [{ data: flowResponse }, { data: form }] = await Promise.all([
      builderAxios.get<{ data: { meta: Flow | null } }>(`/process/${appkey}`),
      builderAxios.get<{ data: { meta: FormMeta } }>(`/form/${appkey}`),
    ]);

    const fields = form.meta.components || [];
    const fieldsTemplate: FlowType['fieldsTemplate'] = fields.map((item) => ({
      name: <string>item.config.label,
      id: <string>item.config.fieldName,
      type: item.config.type,
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

      fillNode.fieldsAuths = formatFieldsAuths(fieldsTemplate);

      flowData = [startNode, fillNode, finishNode];
    } else {
      // 收集流程中所用到的人员
      const memberIds: Set<number | string> = new Set();

      flowRecursion(flowData, (node) => {
        if (node.type === NodeType.FillNode || node.type === NodeType.AuditNode || node.type === NodeType.CCNode) {
          (node.correlationMemberConfig.members || []).forEach((member) => {
            memberIds.add(member);
          });
        }
      });

      // 这样设计为了避免用户更新完头像或者名称后不在节点中更新的问题
      const userResponse = await runtimeAxios.post('/user/list/ids', Array.from(memberIds));
      const cacheMembers: FlowType['cacheMembers'] = {};

      userResponse.data.forEach((member: any) => {
        cacheMembers[member.id] = {
          name: member.userName,
          avatar: member.avatar,
          id: member.id,
        };
      });

      dispatch(flowActions.setCacheMembers(cacheMembers));
    }

    dispatch(flowActions.setFieldsTemplate(fieldsTemplate));
    dispatch(flowActions.setInitialFlow(flowData));
    dispatch(flowActions.setForm(form.meta));
  } finally {
    dispatch(setLoading(false));
  }
});

export const save = createAsyncThunk<void, { subappId: string; showTip?: boolean }, { state: RootState }>(
  'flow/save',
  async ({ subappId, showTip }, { getState, dispatch }) => {
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

      if (!flow.dirty && showTip) {
        message.success('保存成功');

        return;
      }

      dispatch(setLoading(true));

      await builderAxios.post('/process/add', { meta: flowData, subappId });

      if (showTip) {
        message.success('保存成功');
      }

      dispatch(flowActions.setDirty(false));
    } finally {
      dispatch(setLoading(false));
      dispatch(setSaving(false));
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
    } else if (type === NodeType.AutoNode) {
      tmpNode = createNode(type, '自动节点');
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

      tmpNode.fieldsAuths = formatFieldsAuths(getState().flow.fieldsTemplate);
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

export const fieldsTemplateSelector = createSelector(
  (state: RootState) => state.flow.fieldsTemplate,
  (fieldsTemplate) => fieldsTemplate,
);

export const formMetaSelector = createSelector(
  (state: RootState) => state.flow.form,
  (form) => form,
);
