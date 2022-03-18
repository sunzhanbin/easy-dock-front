import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PluginJsonMeta } from "@common/type";
import { RootState } from "@/store";
import { assetCentreBuilder } from "@/http";
import { TableColumnsProps, GroupItem } from "@utils/types";

export interface AssetCentreState {
  JSONMeta?: PluginJsonMeta;
  groupList: GroupItem[];
  pluginsList: TableColumnsProps[];
  bindingTenantList: { id: number; name: string }[];
}

const initialState: AssetCentreState = {
  JSONMeta: {},
  groupList: [],
  pluginsList: [],
  bindingTenantList: [],
};

export const assetCentreSlice = createSlice({
  name: "assetCentre",
  initialState,
  reducers: {
    setJSONMeta: (state, action: PayloadAction<PluginJsonMeta>) => {
      state.JSONMeta = action.payload;
    },
    setPluginsList: (state, action: PayloadAction<any>) => {
      const { pluginsList, columnItem, type } = action.payload;
      state.pluginsList = pluginsList.map((item: TableColumnsProps) => {
        if (item.id === columnItem.id) {
          return {
            ...item,
            [type]: !columnItem[type],
          };
        }
        return item;
      });
    },
    setBindingTenantList: (state, action: PayloadAction<any>) => {
      state.bindingTenantList = action.payload;
      console.log(action, "iiiiii");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(assetCentreBuilder.endpoints.getGroupsList.matchFulfilled, (state, action) => {
      state.groupList = action.payload;
    });
    builder.addMatcher(assetCentreBuilder.endpoints.getPluginsList.matchFulfilled, (state, action) => {
      state.pluginsList = action.payload;
    });
    builder.addMatcher(assetCentreBuilder.endpoints.getBindingTenant.matchFulfilled, (state, action) => {
      state.bindingTenantList = action.payload;
    });
  },
});

export const { setJSONMeta, setPluginsList, setBindingTenantList } = assetCentreSlice.actions;

export default assetCentreSlice.reducer;

export const selectJsonMeta = (state: RootState) => state.assetCentre.JSONMeta;
export const selectPluginsList = (state: RootState) => state.assetCentre.pluginsList;
export const selectBindingTenantList = (state: RootState) => state.assetCentre.bindingTenantList;
