import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appManagerBuilder, appManagerRunTime } from "@/http";
import { RootState } from "@/store";
import { WorkspaceInitialState } from "@utils/types";
import { NavModeType } from "@/consts";
import { HomeManagerSlice } from "@views/home/index.slice";

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
    builder.addCase(HomeManagerSlice.actions.setProjectId.type, (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    });
    builder.addMatcher(appManagerRunTime.endpoints.workspaceRuntimeDetail.matchFulfilled, (state, action) => {
      const {
        id,
        project: { id: projectId },
        extension,
      } = action.payload;
      state.appId = id;
      state.projectId = projectId;
      if (extension?.meta) {
        const { menuList } = extension.meta;
        state.menu = menuList;
        state.currentId = menuList.length && menuList[0].id;
      }
    });
    builder.addMatcher(appManagerBuilder.endpoints.workspaceDetail.matchFulfilled, (state, action) => {
      const {
        id,
        project: { id: projectId },
        extension,
      } = action.payload;
      state.appId = id;
      state.projectId = projectId;
      if (extension?.meta) {
        const { menuList } = extension.meta;
        state.menu = menuList;
        state.currentId = menuList.length && menuList[0].id;
      }
    });
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
