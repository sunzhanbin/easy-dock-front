import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appManagerRunTime } from "@/http";
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
      window.sessionStorage.setItem("activeMenuId", action.payload);
      state.currentId = action.payload;
    },
  },
  extraReducers: (builder) => {
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
  },
});

export default workspaceSlice.reducer;

export const selectAppId = (state: RootState) => state.workspace.appId;

export const selectName = (state: RootState) => state.workspace.name;

export const selectCurrentId = (state: RootState) => state.workspace.currentId;

export const selectNavMode = (state: RootState) => state.workspace.navMode;

export const selectMenu = (state: RootState) => state.workspace.menu;

export const { setName, setCurrentId } = workspaceSlice.actions;
