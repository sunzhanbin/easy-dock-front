import { createSlice } from '@reduxjs/toolkit';
import { TaskCenterState } from './type';
import { setTodoNum as setTodoNumReducer } from './taskcenter-reducer';

const initialState: TaskCenterState = { todoNum: 0 };
const taskCenter = createSlice({
  name: 'formDesign',
  initialState,
  reducers: {
    setTodoNum: setTodoNumReducer,
  },
});

export const { setTodoNum } = taskCenter.actions;
export default taskCenter.reducer;
