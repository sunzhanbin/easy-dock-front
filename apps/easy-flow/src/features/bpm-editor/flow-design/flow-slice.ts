import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { axios } from '@utils';
import {
  FieldAuth,
  AllNode,
  NodeType,
  StartNode,
  FinishNode,
  UserNode,
  TriggerType,
  Flow,
} from './types';
import { RootState } from '@app/store';
import { fielduuid, createNode } from './util';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/';
  require('./mock');
}

type FlowType = {
  loading: boolean;
  data: Flow | [];
};

const flowInitial: FlowType = {
  loading: false,
  data: [],
};

const flow = createSlice({
  name: 'flow',
  initialState: flowInitial,
  reducers: {
    setLoading(state, { payload: loading }: PayloadAction<boolean>) {
      state.loading = loading;

      return state;
    },
    setInitialFlow(state, { payload: data }: PayloadAction<Flow>) {
      state.data = data;

      return state;
    },
    addNode(state, { payload }: PayloadAction<{ index: number; node: UserNode }>) {
      const { data } = state;
      const { index, node } = payload;

      state.data.splice(index, 0, node);

      return state;
    },
    updateNode(state, { payload }: PayloadAction<{ node: AllNode; index: number }>) {
      const { node, index } = payload;

      state.data.splice(index, 1, node);

      return state;
    },
    delNode(state, { payload }: PayloadAction<{ index: number }>) {
      state.data.splice(payload.index, 1);

      return state;
    },
  },
});

export const { setLoading, addNode, updateNode, delNode } = flow.actions;
const flowActions = flow.actions;

// 加载应用的流程，对于初始创建的应用是null
export const load = createAsyncThunk('flow/load', async (appkey: string, { dispatch }) => {
  try {
    dispatch(setLoading(true));

    const { data } = await axios.get<Flow | null>(`/fetch-flow/${appkey}`);

    if (!data || !data.length) {
      // 如果没有流程就初始化一个
      const startNode: StartNode = {
        id: fielduuid(),
        type: NodeType.StartNode,
        name: '开始节点',
        trigger: {
          type: TriggerType.MANUAL,
        },
      };

      const userNode = createNode(NodeType.UserNode, '用户节点');

      const finishNode: FinishNode = {
        id: fielduuid(),
        type: NodeType.FinishNode,
        name: '结束节点',
        notificationContent: '',
      };

      dispatch(flowActions.setInitialFlow([startNode, userNode, finishNode]));
    } else {
      dispatch(flowActions.setInitialFlow(data));
    }
  } finally {
    dispatch(setLoading(false));
  }
});

export default flow;

const defaultFields: FieldAuth[] = [
  {
    id: 'field-order',
    auth: 1,
  },
  {
    id: 'field-applicant',
    auth: 1,
  },
  {
    id: 'field-start-time',
    auth: 1,
  },
  {
    id: 'field-update-time',
    auth: 1,
  },
];

// 聚合form和flow, 因为flow的字段权限需要form的字段信息
export const flowDataSelector = createSelector(
  [(state: RootState) => state.formDesign, (state: RootState) => state.flow],
  (form, flow) => {
    const formFields: FieldAuth[] = (form && form.byId
      ? Object.keys(form.byId)
      : ['input-1', 'select-2']
    ).map((fieldId) => ({
      id: fieldId,
      auth: 1,
    }));

    return {
      loading: flow.loading,
      data: flow.data,
      fieldsTemplate: defaultFields.concat(formFields),
    };
  },
);
