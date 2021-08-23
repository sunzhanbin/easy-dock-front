import { createSlice, createSelector, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskCenterState, App } from './type';
import { setTodoNum as setTodoNumReducer } from './taskcenter-reducer';
import { RootState } from '@/app/store';
import { runtimeAxios } from '@/utils';

const initialState: TaskCenterState = { todoNum: 0 };
const taskCenter = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTodoNum: setTodoNumReducer,
    setApp(state, { payload }: PayloadAction<App>) {
      state.app = payload;
    },
  },
});

export const { setTodoNum, setApp } = taskCenter.actions;
export const loadApp = createAsyncThunk('app/load', async (appId: string, { dispatch }) => {
  const { data: detailResponse } = await runtimeAxios.get(`/app/${appId}`);
  console.info(detailResponse, 'detailResponse');
  dispatch(setApp(detailResponse));
});
export const appSelector = createSelector([(state: RootState) => state.taskCenter], (data) => data.app);
export default taskCenter.reducer;
