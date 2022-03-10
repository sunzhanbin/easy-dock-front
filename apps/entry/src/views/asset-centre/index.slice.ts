import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { PluginDataConfig } from "@common/type";
import { RootState } from "@/store";
import { assetCentreBuilder } from "@/http";

export interface AssetCentreState {
  JSONMeta?: PluginDataConfig;
  groupList: { id: number; name: string }[];
}

const initialState: AssetCentreState = {
  JSONMeta: {},
  groupList: [],
};

export const assetCentreSlice = createSlice({
  name: "assetCentre",
  initialState,
  reducers: {
    setJSONMeta: (state, action: PayloadAction<PluginDataConfig>) => {
      state.JSONMeta = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(assetCentreBuilder.endpoints.getGroupsList.matchFulfilled, (state, action) => {
      state.groupList = action.payload;
      console.log(action.payload, "action.payload");
    });
  },
});

export const { setJSONMeta } = assetCentreSlice.actions;

export default assetCentreSlice.reducer;

export const selectJsonMeta = (state: RootState) => state.assetCentre.JSONMeta;
