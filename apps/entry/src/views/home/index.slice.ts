import { homeManage } from "@/http";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
// import { fetchUser } from '@utils/apis';

export interface HomeManagerState {
  projectList: { [key: string]: any }[];
}

const initialState: HomeManagerState = {
  projectList: [],
};

export const HomeManagerSlice = createSlice({
  name: "homeManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      homeManage.endpoints.getProjectList.matchFulfilled,
      (state, action) => {
        state.projectList = action.payload;
        // console.log("数据来了", current(state), action.payload);
      }
    );
  },
});

// export const {} = HomeManagerSlice.actions;

export default HomeManagerSlice.reducer;
