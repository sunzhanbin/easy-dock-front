import { createSlice, createSelector, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { TaskCenterState, App } from "./type";
import { setTodoNum as setTodoNumReducer } from "./taskcenter-reducer";
import { RootState } from "@/app/store";
import { runtimeAxios } from "@/utils";

const initialState: TaskCenterState = { todoNum: 0, theme: "light", mode: "running" };
const taskCenter = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTodoNum: setTodoNumReducer,
    setApp(state, { payload }: PayloadAction<App>) {
      state.app = payload;
    },
    setTheme(state, { payload }: PayloadAction<string>) {
      state.theme = payload;
    },
    setMode(state, { payload }: PayloadAction<string>) {
      state.mode = payload;
    },
  },
});

export const { setTodoNum, setApp, setTheme, setMode } = taskCenter.actions;
export const loadApp = createAsyncThunk("app/load", async (appId: string, { dispatch }) => {
  const { data: detailResponse } = await runtimeAxios.get(`/app/${appId}`);
  dispatch(setApp(detailResponse));
});
export const appSelector = createSelector([(state: RootState) => state.taskCenter], (data) => data.app);
export const themeSelector = createSelector([(state: RootState) => state.taskCenter], (data) => data.theme);
export const modeSelector = createSelector([(state: RootState) => state.taskCenter], (data) => data.mode);
export default taskCenter.reducer;
