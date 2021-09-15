import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import ReportDetail from '../pages/report-detail/store';

export const store = configureStore({
  reducer: {
    ReportDetail: ReportDetail,
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
