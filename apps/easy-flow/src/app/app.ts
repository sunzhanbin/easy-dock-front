import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useAppSelector } from '@app/hooks';
import { SubApp } from '@type/subapp';
import { builderAxios, runtimeAxios } from '@utils';
import { Member, Role, Dept } from '@type';

export type Visits = {
  depts: Dept[];
  members: Member[];
  roles: Role[];
};
export interface SubAppState {
  loading: boolean;
  dirty: boolean;
  data?: SubApp;
  extend?: {
    config: {
      openVisit?: boolean;
      meta?: SubApp['meta'];
    };
    visits?: Visits;
  };
}

const subapp = createSlice({
  name: 'subapp',
  initialState: { loading: false } as SubAppState,
  reducers: {
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
    setApp(state, { payload }: PayloadAction<SubApp>) {
      state.data = payload;
    },
    setDirty(state, { payload }: PayloadAction<boolean>) {
      state.dirty = payload;
    },
    setExtend(state, { payload }: PayloadAction<Partial<SubAppState['extend']>>) {
      state.extend = Object.assign({}, state.extend, payload);
    },
  },
});

export const { setLoading, setApp, setExtend, setDirty } = subapp.actions;

export const loadApp = createAsyncThunk<Promise<SubAppState['data']>, string>(
  'subapp/load',
  async (subappId, { dispatch, getState }) => {
    const { subapp } = getState();

    if (subapp.loading) return;

    dispatch(setLoading(true));

    try {
      const { data: detailResponse } = await builderAxios.get(`/subapp/${subappId}`);

      dispatch(setApp(detailResponse));

      return detailResponse;
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const loadExtend = createAsyncThunk<Promise<SubAppState['extend']>, string | number>(
  'subapp/load-extend',
  async (subappId, { dispatch, getState }) => {
    const visits = await fetchVisits(subappId);
    const { subapp } = getState();
    const subappExtend = {
      config: {
        openVisit: subapp.data!.openVisit,
        meta: subapp.data!.meta,
      },
      visits,
    };

    dispatch(setExtend(subappExtend));

    return subappExtend;
  },
);

export const save = createAsyncThunk<void, void>('subapp/save', async (_, { dispatch, getState }) => {
  try {
    const subapp = getState().subapp;

    if (!subapp.dirty) {
      message.success('保存成功');

      return;
    }

    dispatch(setLoading(true));

    message.success('保存成功');

    const subappId = subapp.data!.id;
    const { visits, config = {} } = subapp.extend || {};
    Promise.all([changeVisits(visits, subappId), changeMeta(config, subappId)]);

    dispatch(setDirty(false));
    dispatch(setApp(Object.assign({}, subapp.data, { openVisit: config.openVisit }, { meta: config.meta })));
  } catch (e) {
    console.error(e);

    Promise.reject(e.message || e);
  } finally {
    dispatch(setLoading(false));
  }
});

export default subapp;

const subappSelector = createSelector(
  (state: RootState) => state.subapp,
  (subapp) => subapp,
);

export function useSubAppDetail() {
  return useAppSelector(subappSelector);
}

async function fetchVisits(subappId: string | number): Promise<Visits> {
  return runtimeAxios
    .get<{ data: { id: number; ownerType: 1 | 2 | 3; owner: any }[] }>(`/subapp/${subappId}/powers`)
    .then(({ data }) => {
      const members: Member[] = [];
      const depts: Dept[] = [];
      const roles: Role[] = [];

      data.forEach((item) => {
        if (item.ownerType === 1) {
          members.push({
            id: item.owner.id,
            name: item.owner.userName,
            avatar: item.owner.avatar,
          });
        } else if (item.ownerType === 2) {
          roles.push({
            id: item.owner.id,
            name: item.owner.name,
          });
        } else if (item.ownerType === 3) {
          depts.push({
            id: item.owner.id,
            name: item.owner.name,
          });
        }
      });

      return {
        members,
        depts,
        roles,
      };
    });
}

async function changeVisits(visits: Visits | undefined, subappId: string | number) {
  const privileges: { ownerKey: string; ownerType: 1 | 2 | 3; power: 4 }[] = [];
  const { members = [], depts = [], roles = [] } = visits || {};

  members.forEach((member) => {
    privileges.push({
      ownerKey: String(member.id),
      ownerType: 1,
      power: 4,
    });
  });

  depts.forEach((dept) => {
    privileges.push({
      ownerKey: String(dept.id),
      ownerType: 3,
      power: 4,
    });
  });

  roles.forEach((role) => {
    privileges.push({
      ownerKey: String(role.id),
      ownerType: 2,
      power: 4,
    });
  });

  await runtimeAxios.post(`/privilege/assign/subapp`, {
    id: subappId,
    privileges,
  });
}

async function changeMeta(extendConfig: NonNullable<SubAppState['extend']>['config'], subappId: string | number) {
  await builderAxios.put(`/subapp/meta`, {
    id: subappId,
    ...extendConfig,
  });
}
