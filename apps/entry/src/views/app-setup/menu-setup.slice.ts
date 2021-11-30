import { appManager } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { MenuSetupInitialState } from "@utils/types";
import { findItem } from "@utils/utils";

const initialState: MenuSetupInitialState = {
  currentId: "",
  menu: [],
  menuForm: {},
};

export const menuSetupSlice = createSlice({
  name: "menuSetup",
  initialState,
  reducers: {
    setCurrentId: (state, action: PayloadAction<string>) => {
      state.currentId = action.payload;
    },
    setMenu: (state, action: PayloadAction<any[]>) => {
      state.menu = action.payload;
    },
    setMenuForm: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.menuForm = action.payload;
    },
    add: (
      state,
      action: PayloadAction<{ currentId: string | null; childId: string }>
    ) => {
      const { currentId, childId } = action.payload;
      if (!currentId) {
        return void state.menu.push({
          id: childId,
          name: "一级菜单",
          depth: 1,
          form: state.menuForm,
          children: [],
        });
      }

      const parentItem: any = findItem(currentId, state.menu);
      parentItem.children.push({
        id: childId,
        name: `${parentItem.depth + 1}子级菜单`,
        depth: parentItem.depth + 1,
        form: state.menuForm,
        children: [],
      });
      console.log({ parentItem: current(parentItem), state: current(state) });
    },
    remove: (state, action: PayloadAction<string>) => {
      console.log({ state, parentId: action.payload });
    },
    insert: (state, action: PayloadAction<{ [key: string]: any }>) => {
      const { parentId, currentId, data } = action.payload;
      console.log({ parentId, currentId, data, state });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appManager.endpoints.workspaceDetail.matchFulfilled,
      (state, action) => {
        console.log("workspaceDEtail", current(state), action.payload);
      }
    );
  },
});

export default menuSetupSlice.reducer;

export const selectCurrentId = (state: RootState) => state.menuSetup.currentId;

export const selectMenu = (state: RootState) => state.menuSetup.menu;

export const selectMenuForm = (state: RootState) => state.menuSetup.menuForm;

export const {
  setCurrentId,
  setMenu,
  setMenuForm,
  add,
  remove,
  insert,
} = menuSetupSlice.actions;
