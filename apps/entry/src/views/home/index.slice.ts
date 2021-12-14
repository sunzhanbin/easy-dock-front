import { homeManage } from "@/http";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { RootState } from "@/store";
// import { fetchUser } from '@utils/apis';

export interface HomeManagerState {
  projectId: number; // 当前所属项目ID；
  projectList: { [key: string]: any }[]; // 当前项目List；
}

const initialState: HomeManagerState = {
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
    setProjectList: (
      state,
      action: PayloadAction<{ [key: string]: any }[]>
    ) => {
      console.log(action.payload, "3333");
      state.projectList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      homeManage.endpoints.getProjectList.matchFulfilled,
      (state, action) => {
        state.projectList = action.payload;
        state.projectId = action.payload.length && action.payload[0].id;
      }
    );
  },
});

export const { setProjectId, setProjectList } = HomeManagerSlice.actions;

export const selectProjectId = (state: RootState) => state.home.projectId;

export default HomeManagerSlice.reducer;
