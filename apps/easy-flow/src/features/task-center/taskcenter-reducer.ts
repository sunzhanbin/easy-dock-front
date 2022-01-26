import { RootState } from "@/app/store";
import { createSelector, PayloadAction } from "@reduxjs/toolkit";
import { TaskCenterState } from "./type";

const reducers = {
  setTodoNum(state: TaskCenterState, action: PayloadAction<{ todoNum: number }>) {
    const { todoNum } = action.payload;
    state.todoNum = todoNum;
    return state;
  },
};

export const todoNumSelector = createSelector(
  [
    (state: RootState) => {
      return state.taskCenter;
    },
  ],
  (taskCenter) => {
    return taskCenter.todoNum;
  },
);

export const { setTodoNum } = reducers;
