import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PluginJsonMeta } from "@common/type";
import { RootState } from "@/store";
import { assetCentreBuilder } from "@/http";
import { TableColumnsProps, GroupItem } from "@utils/types";

export interface AssetCentreState {
  JSONMeta?: PluginJsonMeta;
  groupList: GroupItem[];
  pluginsList: TableColumnsProps[];
}

const initialState: AssetCentreState = {
  JSONMeta: {},
  groupList: [],
  pluginsList: [],
};

export const assetCentreSlice = createSlice({
  name: "assetCentre",
  initialState,
  reducers: {
    setJSONMeta: (state, action: PayloadAction<PluginJsonMeta>) => {
      state.JSONMeta = action.payload;
      console.log("json", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(assetCentreBuilder.endpoints.getGroupsList.matchFulfilled, (state, action) => {
      state.groupList = action.payload;
    });
    builder.addMatcher(assetCentreBuilder.endpoints.getPluginsList.matchFulfilled, (state, action) => {
      state.pluginsList = action.payload;
    });
  },
});

export const { setJSONMeta } = assetCentreSlice.actions;

export default assetCentreSlice.reducer;

export const selectJsonMeta = (state: RootState) => state.assetCentre.JSONMeta;
export const selectPluginsList = (state: RootState) => state.assetCentre.pluginsList;
