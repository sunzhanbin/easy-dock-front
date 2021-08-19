import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import formDesignReducer from '../features/bpm-editor/form-design/formdesign-slice';
import flowSlice from '../features/bpm-editor/flow-design/flow-slice';
import taskCenterReducer from '@/features/task-center/taskcenter-slice';
import subapp from './app';

export const store = configureStore({
  reducer: {
    formDesign: formDesignReducer,
    taskCenter: taskCenterReducer,
    flow: flowSlice.reducer,
    subapp: subapp.reducer,
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
