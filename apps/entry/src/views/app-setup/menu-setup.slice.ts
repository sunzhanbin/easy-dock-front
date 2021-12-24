import { SubAppType } from "@/consts";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { MenuSetupInitialState, MenuSetupForm } from "@utils/types";
import { deepSearch, filterAssetConfig, findItem } from "@utils/utils";

const defaultForm: MenuSetupForm = {
  name: "",
  icon: "wukongjian",
  mode: "current",
  asset: "exist",
  assetConfig: {
    subAppType: SubAppType.FORM,
    subAppId: undefined,
    url: "",
  },
};

const initialState: MenuSetupInitialState = {
  currentId: "", // 当前active的菜单
  menu: [], // 菜单list
  menuForm: defaultForm, // 菜单对应的菜单属性
};

export const menuSetupSlice = createSlice({
  name: "menuSetup",
  initialState,
  reducers: {
    setCurrentMenu: (state, action: PayloadAction<string>) => {
      const currentItem: any = findItem(action.payload, state.menu);
      {
        state.currentId = action.payload;
        // 由于菜单切换的时候 没有选择子应用的菜单会带上一个菜单的值  此处需要重置
        let form = JSON.parse(JSON.stringify(currentItem))?.form;
        form = Object.assign({}, form, {
          assetConfig: {
            ...form.assetConfig,
            subAppId: form.assetConfig.subAppId || undefined,
          },
        });
        state.menuForm = form || {};
      }
    },
    setMenu: (state, action: PayloadAction<any[]>) => {
      state.menu = action.payload;
    },
    // 关联菜单与表单信息；
    setMenuForm: (state, action: PayloadAction<MenuSetupForm>) => {
      const currentItem: any = findItem(state.currentId, state.menu);
      // 为了避免初始值为同一个默认值引用，每次新增都需要保证是新的对象；
      currentItem.form = JSON.parse(JSON.stringify(action.payload));
      currentItem.name = action.payload.name;
      state.menuForm = action.payload;
    },
    // 添加菜单；
    add: (
      state,
      action: PayloadAction<{ currentId: string | null; childId: string }>
    ) => {
      const { currentId, childId } = action.payload;
      const childMenuName = currentId ? "二级菜单" : "一级菜单";
      {
        state.currentId = childId;
        state.menuForm = {
          ...defaultForm,
          name: childMenuName,
        };
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
    },
    // 删除菜单；
    remove: (state, action: PayloadAction<string>) => {
      const currentId = action.payload;
      const currentItem: any = findItem(currentId, state.menu);
      const { parentId } = currentItem;
      if (!parentId) {
        state.menu = state.menu?.filter((item) => item.id !== currentId);
      } else {
        const parentItem: any = findItem(parentId, state.menu);
        parentItem.children = parentItem.children?.filter(
          (item: any) => item.id !== currentId
        );
      }
      // 删除后定位到第一个菜单的叶子结点
      const redirectItem = deepSearch(state.menu);
      if (redirectItem) {
        state.currentId = redirectItem.id;
        state.menuForm = JSON.parse(JSON.stringify(redirectItem.form));
      } else {
        state.currentId = "";
        state.menuForm = defaultForm;
      }
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
          state.currentId = "";
          state.menuForm = defaultForm;
        } else {
          const menuList = extension.meta.menuList;
          if (Array.isArray(menuList) && menuList.length > 0) {
            state.menu = menuList;
            const currentItem = deepSearch(menuList);
            state.currentId = currentItem.id;
            state.menuForm = JSON.parse(JSON.stringify(currentItem.form));
          } else {
            state.menu = [];
            state.currentId = "";
            state.menuForm = defaultForm;
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
