import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { WorkspaceInitialState } from "@utils/types";
import { NavModeType } from "@/consts";

const initialState: WorkspaceInitialState = {
  name: "",
  navMode: NavModeType.MULTI,
  menu: [
    {
      id: "05e23c5f-9bde-429c-8d8c-6f42fb64d59d",
      name: "一级菜单610",
      parentId: null,
      depth: 1,
      form: {
        name: "",
        icon: "wukongjian",
        mode: "blank",
        asset: "exist",
        assetConfig: {
          subAppType: 1,
        },
      },
      children: [
        {
          id: "83c24328-a58b-4d2f-9c96-7ee363573340",
          parentId: "05e23c5f-9bde-429c-8d8c-6f42fb64d59d",
          name: "2子级菜单116",
          depth: 2,
          form: {
            name: "",
            icon: "wukongjian",
            mode: "blank",
            asset: "exist",
            assetConfig: {
              subAppType: 1,
            },
          },
          children: [
            {
              id: "fa266597-cb95-40f4-9e02-15d2e0b97d1f",
              parentId: "83c24328-a58b-4d2f-9c96-7ee363573340",
              name: "3子级菜单472",
              depth: 3,
              form: {
                name: "",
                icon: "wukongjian",
                mode: "blank",
                asset: "exist",
                assetConfig: {
                  subAppType: 1,
                },
              },
              children: [],
            },
          ],
        },
        {
          id: "cc52a130-aba6-49d8-8762-1529efac54b4",
          parentId: "05e23c5f-9bde-429c-8d8c-6f42fb64d59d",
          name: "2子级菜单683",
          depth: 2,
          form: {
            name: "",
            icon: "wukongjian",
            mode: "blank",
            asset: "exist",
            assetConfig: {
              subAppType: 1,
            },
          },
          children: [],
        },
        {
          id: "f148ba60-f0b4-4863-9bd2-6773f977261b",
          parentId: "05e23c5f-9bde-429c-8d8c-6f42fb64d59d",
          name: "2子级菜单581",
          depth: 2,
          form: {
            name: "",
            icon: "wukongjian",
            mode: "blank",
            asset: "exist",
            assetConfig: {
              subAppType: 1,
            },
          },
          children: [
            {
              id: "acc0239d-d7f1-43d8-a9f9-e9df238d2248",
              parentId: "f148ba60-f0b4-4863-9bd2-6773f977261b",
              name: "3子级菜单106",
              depth: 3,
              form: {
                name: "",
                icon: "wukongjian",
                mode: "blank",
                asset: "exist",
                assetConfig: {
                  subAppType: 1,
                },
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "ad202590-de30-467d-9dd3-5a00c4c9c3ff",
      name: "一级菜单422",
      parentId: null,
      depth: 1,
      form: {
        name: "",
        icon: "wukongjian",
        mode: "blank",
        asset: "exist",
        assetConfig: {
          subAppType: 1,
        },
      },
      children: [],
    },
  ],
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
