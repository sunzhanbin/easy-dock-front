import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { PluginDataConfig } from "@common/type";
import { RootState } from "@/store";

export interface AssetCentreState {
  JSONMeta?: PluginDataConfig;
}

const initialState: AssetCentreState = {
  JSONMeta: {},
};

export const assetCentreSlice = createSlice({
  name: "assetCentre",
  initialState,
  reducers: {
    setJSONMeta: (state, action: PayloadAction<PluginDataConfig>) => {
      state.JSONMeta = action.payload;
    },
  },
});

export const { setJSONMeta } = assetCentreSlice.actions;

export default assetCentreSlice.reducer;

export const selectJsonMeta = (state: RootState) => state.assetCentre.JSONMeta;
