import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { WorkspaceInitialState } from "@utils/types";
import { NavModeType } from "@/consts";

const initialState: WorkspaceInitialState = {
  name: "",
  navMode: NavModeType.MULTI,
  menu: [],
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appManagerBuilder.endpoints.workspaceDetail.matchFulfilled,
      (state, action) => {
        console.log("workspaceDetail", current(state), action.payload);
      }
    );
  },
});

export default workspaceSlice.reducer;

export const selectName = (state: RootState) => state.workspace.name;

export const selectNavMode = (state: RootState) => state.workspace.navMode;

export const selectMenu = (state: RootState) => state.workspace.menu;

export const { setName } = workspaceSlice.actions;
