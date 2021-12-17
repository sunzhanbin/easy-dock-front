import { SubAppType } from "@/consts";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { MenuSetupInitialState, MenuSetupForm } from "@utils/types";
import { findItem } from "@utils/utils";

const defaultForm: MenuSetupForm = {
  name: "",
  icon: "wukongjian",
  mode: "current",
  asset: "exist",
  assetConfig: {
    subAppType: SubAppType.FORM,
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
        state.menuForm = JSON.parse(JSON.stringify(state.menuForm));
      }
      if (!currentId) {
        state.menu.push({
          id: childId,
          name: state.menuForm.name,
          parentId: null,
          depth: 1,
          form: state.menuForm,
          children: [],
        });
      } else {
        const currentItem: any = findItem(currentId, state.menu);
        currentItem.children.push({
          id: childId,
          parentId: currentItem.id,
          name: state.menuForm.name,
          depth: currentItem.depth + 1,
          form: state.menuForm,
          children: [],
        });
      }
      // 添加菜单之后,form要重置
      state.menuForm = defaultForm;
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
      appManagerBuilder.endpoints.workspaceDetail.matchFulfilled,
      (state, action) => {
        const extension = action.payload?.extension;
        if (!extension?.meta) {
          state.menu = [];
        } else {
          const menuList = extension.meta.menuList;
          if (Array.isArray(menuList) && menuList.length > 0) {
            state.menu = menuList;
          } else {
            state.menu = [];
          }
        }
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
