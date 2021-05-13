import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { axios } from '@utils';
import { BaseNode, Flow, AllNode, NodeType, StartNode, FinishNode } from './types';
import { RootState } from '@app/store';

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
      state = { ...state, data };

      return state;
    },
    addNode(
      state,
      {
        payload,
      }: PayloadAction<{ prevId: string; node: Exclude<AllNode, StartNode | FinishNode> }>,
    ) {
      let success = false;
      let tmpNode: AllNode = state.data!;
      const { prevId, node } = payload;

      while (tmpNode && tmpNode.type !== NodeType.FinishNode) {
        if (tmpNode.id === prevId) {
          let tmpNext = tmpNode.next!;

          tmpNode.next = {
            ...node,
            next: tmpNext,
          };

          success = true;

          break;
        } else {
          tmpNode = tmpNode.next!;
        }
      }

      if (process.env.NODE_ENV === 'development' && !success) {
        throw new Error('新增节点失败');
      }

      return { ...state };
    },
    delNode(state, { payload }: PayloadAction<{ prevId: string }>) {
      let tmpNode: AllNode = state.data!;
      const { prevId } = payload;

      while (tmpNode && tmpNode.type !== NodeType.FinishNode) {
        if (tmpNode.id === prevId) {
          tmpNode.next = (<Exclude<AllNode, FinishNode | null>>tmpNode.next).next!;
        } else {
          tmpNode = tmpNode.next!;
        }
      }

      return { ...state };
    },
  },
});

export const { setLoading } = flow.actions;
export const flowActions = flow.actions;

// 加载应用的流程，对于初始创建的应用是null
export const load = createAsyncThunk<Flow | null, string>(
  'flow/load',
  async (appkey, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const { data: flow } = await axios.get<Flow>(`/fetch-flow/${appkey}`);

      return flow;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export default flow;

const defaultFields: BaseNode['fieldsAuths'] = [
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
    const formFields: BaseNode['fieldsAuths'] = (form && form.byId
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
