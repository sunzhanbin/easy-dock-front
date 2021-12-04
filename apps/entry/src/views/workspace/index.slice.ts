import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { appManager } from "@/http";
import { RootState } from "@/store";

const initialState = {
  name: "",
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
      appManager.endpoints.workspaceDetail.matchFulfilled,
      (state, action) => {
        console.log("workspaceDetail", current(state), action.payload);
      }
    );
  },
});

export default workspaceSlice.reducer;

export const selectName = (state: RootState) => state.workspace.name;

export const { setName } = workspaceSlice.actions;
