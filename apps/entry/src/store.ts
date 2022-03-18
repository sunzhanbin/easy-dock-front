import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import appsOrchestrationApi, { runTime as appsOrchestrationRuntimeApi } from "@utils/fetch";

import appManagerSlice from "@views/app-manager/index.slice";
import homeManageSlice from "@views/home/index.slice";
import basicSetupSlice from "@views/app-setup/basic-setup.slice";
import menuSetupSlice from "@views/app-setup/menu-setup.slice";
import workspaceSlice from "@views/workspace/index.slice";
import assetCentreSlice from "@views/asset-centre/index.slice";

export const store = configureStore({
  reducer: {
    [appsOrchestrationApi.reducerPath]: appsOrchestrationApi.reducer,
    [appsOrchestrationRuntimeApi.reducerPath]: appsOrchestrationRuntimeApi.reducer,
    appManager: appManagerSlice,
    assetCentre: assetCentreSlice,
    basicSetup: basicSetupSlice,
    menuSetup: menuSetupSlice,
    workspace: workspaceSlice,
    home: homeManageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(appsOrchestrationApi.middleware, appsOrchestrationRuntimeApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
