import { homeManageBuilder, homeManageRuntime } from "@/http";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { RoleEnum, User } from "@utils/types";
import cookie from "js-cookie";

import { auth } from "@/consts";
import { axios } from "@utils/fetch";

export interface HomeManagerState {
  userInfo: User | null;
  projectId: number; // 当前所属项目ID；
  isAdmin: boolean; // 是否是超级管理员
  projectList: { [key: string]: any }[]; // 当前项目List
  projectAuthList: { [key: string]: any }[]; // 当前管理员下的所有的项目
}

const initialState: HomeManagerState = {
  userInfo: null,
  isAdmin: false,
  projectId: 0,
  projectList: [],
  projectAuthList: [],
};

export const HomeManagerSlice = createSlice({
  name: "homeManager",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<number>) => {
      state.projectId = action.payload;
    },
    logout: (state) => {
      auth.logout();
      state.userInfo = null;
      delete axios.defaults.headers.auth;
      // 清掉cookie
      cookie.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(homeManageBuilder.endpoints.getProjectList.matchFulfilled, (state, action) => {
      state.projectList = action.payload;
      state.projectId = action.payload.length && action.payload[0].id;
    });
    builder.addMatcher(homeManageRuntime.endpoints.getUserInfo.matchFulfilled, (state, action) => {
      const { power, user } = action.payload;
      state.userInfo = {
        avatar: user.avatar,
        username: user.userName,
        id: user.id,
        power: power,
      };
      state.isAdmin = (power & RoleEnum.ADMIN) === RoleEnum.ADMIN;
    });
    builder.addMatcher(homeManageBuilder.endpoints.fetchProjectPowers.matchFulfilled, (state, action) => {
      state.projectAuthList = action.payload;
    });
  },
});

export const { setProjectId, logout } = HomeManagerSlice.actions;

export const selectProjectId = (state: RootState) => state.home.projectId;
export const selectUserInfo = (state: RootState) => state.home.userInfo;
export const selectIsAdmin = (state: RootState) => state.home.isAdmin;
export const selectProjectAuthList = (state: RootState) => state.home.projectAuthList;

export default HomeManagerSlice.reducer;
