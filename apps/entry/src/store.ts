import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import appsOrchestrationApi from "@utils/fetch";
import appManagerSlice from "@views/app-manager/index.slice";
import appSetupSlice from "@views/app-setup/index.slice";

export const store = configureStore({
  reducer: {
    [appsOrchestrationApi.reducerPath]: appsOrchestrationApi.reducer,
    appManager: appManagerSlice,
    appSetup: appSetupSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(appsOrchestrationApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
