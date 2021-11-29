import { appManager } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { appManagerInitialState } from "@utils/types";

const initialState: appManagerInitialState = {
  theme: "theme1",
  navMode: 0,
  logo: {},
  basicForm: {},
  menuForm: {},
};

export const appSetupSlice = createSlice({
  name: "appSetup",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setMode: (state, action: PayloadAction<number>) => {
      state.navMode = action.payload;
    },
    setLogo: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.logo = action.payload;
    },
    setBaseForm: (state, action: PayloadAction<{ [key: string]: any }>) => {
      const icon = action.payload.icon?.[0]?.response?.[0];
      if (typeof action.payload === "object" && icon) {
        state.basicForm = JSON.parse(JSON.stringify(action.payload));
        state.basicForm.icon = icon;
      }
    },
    setMenuForm: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.menuForm = action.payload;
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

export default appSetupSlice.reducer;

export const selectTheme = (state: RootState) => state.appSetup.theme;

export const selectNavMode = (state: RootState) => state.appSetup.navMode;

export const selectBasicForm = (state: RootState) => state.appSetup.basicForm;

export const selectMenuForm = (state: RootState) => state.appSetup.menuForm;

export const {
  setTheme,
  setMode,
  setBaseForm,
  setMenuForm,
} = appSetupSlice.actions;
