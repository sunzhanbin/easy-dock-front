import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import formDesignReducer from '../features/bpm-editor/form-design/formdesign-slice';
import flowSlice from '../features/bpm-editor/flow-design/flow-slice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    formDesign: formDesignReducer,
    flow: flowSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
