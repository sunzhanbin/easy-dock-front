import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { WorkspaceInitialState } from "@utils/types";
import { NavModeType } from "@/consts";

const initialState: WorkspaceInitialState = {
  name: "",
  navMode: NavModeType.MULTI,
  currentId: "", // 菜单id
  appId: "",
  projectId: "",
  menu: [],
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.currentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appManagerBuilder.endpoints.workspaceDetail.matchFulfilled,
      (state, action) => {
        const {
          id,
          project: { id: projectId },
        } = action.payload;
        state.appId = id;
        state.projectId = projectId;
      }
    );
  },
});

export default workspaceSlice.reducer;

export const selectAppId = (state: RootState) => state.workspace.appId;

export const selectProjectId = (state: RootState) => state.workspace.projectId;

export const selectName = (state: RootState) => state.workspace.name;

export const selectCurrentId = (state: RootState) => state.workspace.currentId;

export const selectNavMode = (state: RootState) => state.workspace.navMode;

export const selectMenu = (state: RootState) => state.workspace.menu;

export const { setName, setCurrentId } = workspaceSlice.actions;
