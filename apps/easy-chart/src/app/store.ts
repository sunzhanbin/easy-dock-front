import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import subapp from './app';

export const store = configureStore({
  reducer: {
    subapp: subapp.reducer,
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
