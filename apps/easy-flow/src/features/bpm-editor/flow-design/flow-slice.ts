import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createDraftSafeSelector,
} from '@reduxjs/toolkit';
import { axios } from '@utils';
import { BaseNode, Flow, AllNode, NodeType, StartNode, FinishNode } from './types';
import { RootState } from '@app/store';
import { createInitialFlow } from './util';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/';
  require('./mock');
}

type FlowType = {
  loading: boolean;
  data: Flow | null;
};

const flowInitial: FlowType = {
  loading: false,
  data: null,
};

function findNodeById(start: AllNode | null, nodeId: string): AllNode | null {
  while (start) {
    if (start.id === nodeId) {
      return start;
    } else if (start.type === NodeType.BranchNode) {
      start.branches.forEach((branch) => {
        findNodeById(branch.next, nodeId);
      });
    } else {
      findNodeById(start.next, nodeId);
    }
  }

  return null;
}

const flow = createSlice({
  name: 'flow',
  initialState: flowInitial,
  reducers: {
    setLoading(state, { payload: loading }: PayloadAction<boolean>) {
      state = {
        ...state,
        loading,
      };

      return state;
    },
    setInitialFlow(state, { payload: data }: PayloadAction<Flow>) {
      state.data = data;

      return state;
    },
    addNode(
      state,
      {
        payload,
      }: PayloadAction<{ prevId: string; node: Exclude<AllNode, StartNode | FinishNode> }>,
    ) {
      const { data } = state;
      const { prevId, node } = payload;
      const prevNode = findNodeById(data, prevId);

      if (prevNode) {
        node.next = prevNode.next;
        prevNode.next = node;
      }

      return state;
    },
    updateNode(state, { payload }: PayloadAction<{ prevId: string; node: AllNode }>) {
      if (!state.data) return state;

      const { prevId, node } = payload;

      // 修改开始节点
      if (node.type === NodeType.StartNode) {
        state.data = node;
      } else {
        const prevNode = findNodeById(state.data, prevId);

        if (prevNode) {
          node.next = prevNode.next!.next;
          prevNode.next = node;
        }
      }

      return state;
    },
    delNode(state, { payload }: PayloadAction<{ prevId: string }>) {
      const prevNode = findNodeById(state.data, payload.prevId);

      if (prevNode && prevNode.next) {
        prevNode.next = prevNode.next.next;
      }

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

    if (!data) {
      // 如果没有流程就初始化一个
      dispatch(flowActions.setInitialFlow(createInitialFlow()));
    } else {
      dispatch(flowActions.setInitialFlow(data));
    }
  } finally {
    dispatch(setLoading(false));
  }
});

export default flow;

type FieldsAuths = Readonly<BaseNode['fieldsAuths'][number]>;

const defaultFields: FieldsAuths[] = [
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
    const formFields: FieldsAuths[] = (form && form.byId
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
