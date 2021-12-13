import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { appManager } from "@/http";
import { AppManagerInitialState } from "@utils/types";

const initialState: AppManagerInitialState = {
  currentWorkspaceId: 0, // 当前工作ID；
};

export const appManagerSlice = createSlice({
  name: "appManager",
  initialState,
  reducers: {
    setCurrentWorkspaceId: (state, action: PayloadAction<number>) => {
      state.currentWorkspaceId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appManager.endpoints.fetchWorkspaceList.matchFulfilled,
      (state, action) => {
        const {
          payload: [defualtWorkspace],
        } = action;
        state.currentWorkspaceId = defualtWorkspace.id;
      }
    );
  },
});

export default appManagerSlice.reducer;

export const { setCurrentWorkspaceId } = appManagerSlice.actions;

export const selectCurrentWorkspaceId = (state: RootState) =>
  state.appManager.currentWorkspaceId;
