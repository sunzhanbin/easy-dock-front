import { homeManageBuilder, homeManageRuntime } from "@/http";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { User } from "@utils/types";
import cookie from "js-cookie";

import Auth from "@enc/sso";
import { axios } from "@utils/fetch";

export interface HomeManagerState {
  userInfo: User | null;
  projectId: number; // 当前所属项目ID；
  projectList: { [key: string]: any }[]; // 当前项目List；
}

const initialState: HomeManagerState = {
  userInfo: null,
  projectId: 0,
  projectList: [],
};

export const HomeManagerSlice = createSlice({
  name: "homeManager",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<number>) => {
      state.projectId = action.payload;
    },
    logout: (state) => {
      Auth.logout();
      state.userInfo = null;
      delete axios.defaults.headers.auth;
      // 清掉cookie
      cookie.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      homeManageBuilder.endpoints.getProjectList.matchFulfilled,
      (state, action) => {
        state.projectList = action.payload;
        state.projectId = action.payload.length && action.payload[0].id;
      }
    );
    builder.addMatcher(
      homeManageRuntime.endpoints.getUserInfo.matchFulfilled,
      (state, action) => {
        const { power, user } = action.payload;
        state.userInfo = {
          avatar: user.avatar,
          username: user.userName,
          id: user.id,
          power: power,
        };
      }
    );
  },
});

export const { setProjectId, logout } = HomeManagerSlice.actions;

export const selectProjectId = (state: RootState) => state.home.projectId;
export const selectUserInfo = (state: RootState) => state.home.userInfo;

export default HomeManagerSlice.reducer;
