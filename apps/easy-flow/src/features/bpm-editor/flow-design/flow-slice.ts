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
  RevertType,
  AuthType,
  FieldAuthsMap,
} from '@type/flow';
import { FormMeta } from '@type';
import { Api } from '@type/api';
import { RootState } from '@app/store';
import { fielduuid, createNode, flowUpdate, branchUpdate, valid, ValidResultType, formatFieldsAuths } from './util';
import { queryApis } from '../components/data-api-config/util';

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
  apis: Api[];
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
  apis: [],
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

      flowRecursion(state.data, (node) => {
        if (node.type === NodeType.AuditNode) {
          if (node.revert.type === RevertType.Specify && node.revert.nodeId === nodeId) {
            delete node.revert.nodeId;
          }
        }
      });

      state.dirty = true;

      delete state.invalidNodesMap[nodeId];
    },
    setApis(state, { payload }: PayloadAction<Api[]>) {
      state.apis = payload;
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
      id: <string>item.config.fieldName || item.config.id,
      type: item.config.type,
    }));

    let flowData = flowResponse.meta || [];

    if (!flowData.length) {
      let fieldsAuths = formatFieldsAuths(fieldsTemplate);

      // 如果没有流程就初始化一个
      const startNode: StartNode = {
        id: fielduuid(),
        type: NodeType.StartNode,
        name: '开始节点',
        trigger: {
          type: TriggerType.MANUAL,
        },
        fieldsAuths,
      };

      const finishNode: FinishNode = {
        id: fielduuid(),
        type: NodeType.FinishNode,
        name: '结束节点',
        notificationContent: '',
      };

      const fillNode: FillNode = createNode(NodeType.FillNode, '填写节点');

      fillNode.fieldsAuths = fieldsAuths;

      flowData = [startNode, fillNode, finishNode];
    } else {
      // 收集流程中所用到的人员
      const userIds: Set<number | string> = new Set();
      const deptIds: Set<number | string> = new Set();
      const roleIds: Set<number | string> = new Set();

      let fieldsMap = fieldsTemplate.reduce((curr, prev) => {
        curr[prev.id] = true;
        return curr;
      }, {} as { [key: string]: true });

      flowRecursion(flowData, (node) => {
        if (
          node.type === NodeType.FillNode ||
          node.type === NodeType.AuditNode ||
          node.type === NodeType.CCNode ||
          node.type === NodeType.StartNode
        ) {
          if (node.type !== NodeType.StartNode) {
            // 舍弃办理人动态值里的多余字段
            node.correlationMemberConfig.dynamic = Object.assign({}, node.correlationMemberConfig.dynamic, {
              fields: (node.correlationMemberConfig.dynamic?.fields || []).filter((field) => fieldsMap[field]),
            });

            // 提取每个节点的人员
            (node.correlationMemberConfig.members || []).forEach((member) => {
              userIds.add(member);
            });

            // 提取每个节点中的部门
            (node.correlationMemberConfig.depts || []).forEach((dept) => {
              deptIds.add(dept);
            });

            // 提取每个节点中的角色
            (node.correlationMemberConfig.roles || [])
              .concat(node.correlationMemberConfig.dynamic?.roles || [])
              .forEach((role) => {
                roleIds.add(role);
              });
          }

          const fieldsAuths: FieldAuthsMap = {};

          // 舍弃冗余字段
          fieldsTemplate.forEach((field) => {
            if (node.fieldsAuths && node.fieldsAuths[field.id] !== undefined) {
              fieldsAuths[field.id] = node.fieldsAuths[field.id];
            } else {
              fieldsAuths[field.id] = AuthType.View;
            }
          });

          node.fieldsAuths = fieldsAuths;
        } else if (node.type === NodeType.BranchNode) {
          node.branches = node.branches.map((branch) => {
            return {
              ...branch,
              conditions: branch.conditions.map((row) => {
                return row.filter((col) => fieldsMap[col.fieldName as string]);
              }),
            };
          });
        }
      });

      // 这样设计为了避免用户更新完头像或者名称后不在节点中更新的问题
      const userResponse = await runtimeAxios.post('/user/query/owner', {
        deptIds: Array.from(deptIds),
        userIds: Array.from(userIds),
        roleIds: Array.from(roleIds),
      });

      const cacheMembers: FlowType['cacheMembers'] = {};

      (userResponse.data.users || []).forEach((user: { id: number; userName: string; avatar?: string }) => {
        cacheMembers[user.id] = {
          id: user.id,
          name: user.userName,
          avatar: user.avatar,
        };
      });

      (userResponse.data.depts || []).forEach((dept: { id: number; name: string }) => {
        cacheMembers[dept.id] = {
          id: dept.id,
          name: dept.name,
        };
      });

      (userResponse.data.roles || []).forEach((role: { id: number; name: string }) => {
        cacheMembers[role.id] = {
          id: role.id,
          name: role.name,
        };
      });

      dispatch(flowActions.setCacheMembers(cacheMembers));
    }

    dispatch(flowActions.setFieldsTemplate(fieldsTemplate));
    dispatch(flowActions.setInitialFlow(flowData));
    dispatch(flowActions.setForm(form.meta));
    dispatch(flowActions.setInvalidMaps({}));
  } catch (e) {
    console.error(e);
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

    try {
      const validResult: FlowType['invalidNodesMap'] = valid(flowData, {});

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
    } catch (e) {
      console.error(e);

      Promise.reject(e.message || e);
    } finally {
      dispatch(setLoading(false));
      dispatch(setSaving(false));
    }
  },
);

export const loadApis = createAsyncThunk('flow/load-api', async (_, { dispatch }) => {
  const apis = await queryApis();

  dispatch(flowActions.setApis(apis));
});

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

export const flowDataSelector = createSelector([(state: RootState) => state.flow], (flow) => flow);

export const fieldsTemplateSelector = createSelector(
  (state: RootState) => state.flow.fieldsTemplate,
  (fieldsTemplate) => fieldsTemplate,
);

export const formMetaSelector = createSelector(
  (state: RootState) => state.flow.form,
  (form) => form,
);

export const apisSelector = createSelector([(state: RootState) => state.flow.apis], (apis) => apis);
