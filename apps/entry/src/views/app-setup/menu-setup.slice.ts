import { appManager } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { MenuSetupInitialState, MenuSetupForm } from "@utils/types";
import { findItem } from "@utils/utils";

const defaultForm: MenuSetupForm = {
  name: "",
  showMenu: false,
  icon: "icon1",
  mode: "blank",
  isHome: false,
  asset: "exist",
  assetConfig: {
    app: "flow",
    subapp: "absence",
    url: "www.baidu.com",
  },
};

const initialState: MenuSetupInitialState = {
  currentId: "",
  menu: [],
  menuForm: defaultForm,
};

export const menuSetupSlice = createSlice({
  name: "menuSetup",
  initialState,
  reducers: {
    setCurrentMenu: (state, action: PayloadAction<string>) => {
      const currentItem: any = findItem(action.payload, state.menu);
      {
        state.currentId = action.payload;
        state.menuForm = JSON.parse(JSON.stringify(currentItem))?.form || {};
      }
    },
    setMenu: (state, action: PayloadAction<any[]>) => {
      state.menu = action.payload;
    },
    // 关联菜单与表单信息；
    setMenuForm: (state, action: PayloadAction<MenuSetupForm>) => {
      const currentItem: any = findItem(state.currentId, state.menu);
      currentItem.form = JSON.parse(JSON.stringify(action.payload));
      state.menuForm = action.payload;
    },
    // 添加菜单；
    add: (
      state,
      action: PayloadAction<{ currentId: string | null; childId: string }>
    ) => {
      const { currentId, childId } = action.payload;
      {
        state.currentId = childId;
        // 为了避免初始值为同一个默认值引用，每次新增都需要保证是新的对象；
        state.menuForm = JSON.parse(JSON.stringify(defaultForm));
      }
      if (!currentId) {
        return void state.menu.push({
          id: childId,
          name: `一级菜单${(1000 * Math.random()).toFixed()}`,
          parentId: null,
          depth: 1,
          form: state.menuForm,
          children: [],
        });
      }

      const currentItem: any = findItem(currentId, state.menu);
      currentItem.children.push({
        id: childId,
        parentId: currentItem.id,
        name: `${currentItem.depth + 1}子级菜单${(
          1000 * Math.random()
        ).toFixed()}`,
        depth: currentItem.depth + 1,
        form: state.menuForm,
        children: [],
      });
    },
    // 删除菜单；
    remove: (state, action: PayloadAction<string>) => {
      const currentId = action.payload;
      const currentItem: any = findItem(currentId, state.menu);
      const { parentId } = currentItem;
      if (!parentId) {
        state.menu = state.menu?.filter((item) => item.id !== currentId);
        return;
      }

      const parentItem: any = findItem(parentId, state.menu);
      parentItem.children = parentItem.children?.filter(
        (item: any) => item.id !== currentId
      );
    },
    // 插入菜单；拖拽时预留；
    insert: (state, action: PayloadAction<{ [key: string]: any }>) => {
      console.log({ state: current(state), action });
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
  setCurrentMenu,
  setMenu,
  setMenuForm,
  add,
  remove,
  insert,
} = menuSetupSlice.actions;
