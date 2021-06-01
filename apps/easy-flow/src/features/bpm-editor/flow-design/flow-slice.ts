import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { message } from 'antd';
import { axios } from '@utils';
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
} from './types';
import { RootState } from '@app/store';
import { fielduuid } from './util';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/';
  require('./mock');
}

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
};

const flowInitial: FlowType = {
  loading: false,
  data: [],
  dirty: false,
  invalidNodesMap: {},
  cacheMembers: {},
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

function flowMemberKeys(flowData: Flow) {
  function flowRecursion(flowData: Flow, keys: { members: string[] }) {
    flowData.forEach((node) => {
      if (node.type === NodeType.AuditNode || node.type === NodeType.FillNode) {
        keys.members = keys.members.concat(node.correlationMemberConfig.members);
      } else if (node.type === NodeType.BranchNode) {
        node.branches.forEach((sBranch) => {
          flowRecursion(sBranch.nodes, keys);
        });
      }
    });

    return keys;
  }

  const allKeys = flowRecursion(flowData, { members: [] });

  allKeys.members = Array.from(new Set(allKeys.members));

  return allKeys;
}

const flow = createSlice({
  name: 'flow',
  initialState: flowInitial,
  reducers: {
    setCacheMembers(state, { payload }: PayloadAction<FlowType['cacheMembers']>) {
      state.cacheMembers = {
        ...state.cacheMembers,
        ...payload,
      };

      return state;
    },
    setInvalidMaps(state, { payload: validRes }: PayloadAction<FlowType['invalidNodesMap']>) {
      state.invalidNodesMap = validRes;

      return state;
    },
    setDirty(state, { payload: dirty }: PayloadAction<boolean>) {
      state.dirty = dirty;

      return state;
    },
    setLoading(state, { payload: loading }: PayloadAction<boolean>) {
      state.loading = loading;

      return state;
    },
    setInitialFlow(state, { payload: data }: PayloadAction<Flow>) {
      state.data = data;

      return state;
    },
    addNode(state, { payload }: PayloadAction<{ prevId: string; node: AuditNode | FillNode }>) {
      const { prevId, node } = payload;

      state.data = flowUpdate(state.data, prevId, node);
      state.dirty = true;

      return state;
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

      return state;
    },
    delNode(state, { payload: nodeId }: PayloadAction<string>) {
      state.data = flowUpdate(state.data, nodeId, null);
      state.dirty = true;

      delete state.invalidNodesMap[nodeId];

      return state;
    },
  },
});

const flowActions = flow.actions;
export const { setLoading, addNode, updateNode, delNode, setCacheMembers } = flow.actions;

// 加载应用的流程，对于初始创建的应用是null
export const load = createAsyncThunk('flow/load', async (appkey: string, { dispatch }) => {
  try {
    dispatch(setLoading(true));

    let { data: flowData } = await axios.get<Flow | null>(`/fetch-flow/${appkey}`);

    if (!flowData || !flowData.length) {
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

      flowData = [startNode, finishNode];
    }

    const { members } = flowMemberKeys(flowData);

    // members 为一组成员id，这样设计为了避免用户更新完头像或者名称后不在节点中更新的问题
    const userResponse = await axios.post('/user/list', { data: members });
    const cacheMembers: FlowType['cacheMembers'] = {};

    userResponse.data.forEach((member: any) => {
      cacheMembers[member.loginName] = {
        name: member.name,
        avatar: member.avatar,
        loginName: member.loginName,
      };
    });

    dispatch(flowActions.setCacheMembers(cacheMembers));
    dispatch(flowActions.setInitialFlow(flowData));
  } finally {
    dispatch(setLoading(false));
  }
});

export const save = createAsyncThunk<void, string, { state: RootState }>(
  'flow/save',
  async (appkey: string, { getState, dispatch }) => {
    const flowData = getState().flow.data;
    const validResult: FlowType['invalidNodesMap'] = valid(flowData, {});

    if (Object.keys(validResult).length) {
      dispatch(flowActions.setInvalidMaps(validResult));

      message.error('数据填写不完整');

      return;
    }

    try {
      dispatch(setLoading(true));

      await axios.post('/save-flow', { data: flowData, appkey });

      message.success('保存成功');
      dispatch(flowActions.setDirty(false));
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export default flow;

// 聚合form和flow, 因为flow的字段权限需要form的字段信息
export const flowDataSelector = createSelector(
  [(state: RootState) => state.formDesign, (state: RootState) => state.flow],
  (form, flow) => {
    const formFields = (form && form.byId ? Object.keys(form.byId) : ['input-1', 'select-2']).map(
      (fieldId) => ({
        id: fieldId,
        name: '表单字段',
        auth: 1,
      }),
    );

    return {
      ...flow,
      fieldsTemplate: formFields,
    };
  },
);
