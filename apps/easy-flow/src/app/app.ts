import { useAppSelector } from '@app/hooks';
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { builderAxios } from '@utils';

export interface SubAppState {
  loading: boolean;
  data?: {
    name: string;
    id: number;
    app: {
      name: string;
      id: number;
      project: {
        name: string;
        id: number;
      };
    };
  };
}

const subapp = createSlice({
  name: 'subapp',
  initialState: { loading: false } as SubAppState,
  reducers: {
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
    setApp(state, { payload }: PayloadAction<SubAppState['data']>) {
      state.data = payload;
    },
  },
});

const { setLoading, setApp } = subapp.actions;

export const loadApp = createAsyncThunk('subapp/load', async (subappId: string, { dispatch }) => {
  dispatch(setLoading(true));

  try {
    const { data: detailResponse } = await builderAxios.get(`/subapp/${subappId}`);

    dispatch(
      setApp({
        name: detailResponse.name,
        id: detailResponse.id,
        app: {
          name: detailResponse.app.name,
          id: detailResponse.app.id,
          project: {
            name: detailResponse.app.project.name,
            id: detailResponse.app.project.id,
          },
        },
      }),
    );
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
