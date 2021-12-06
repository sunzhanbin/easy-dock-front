import { appManager } from "@/http";
import { RootState } from "@/store";
import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { BasicSetupInitialState } from "@utils/types";

const initialState: BasicSetupInitialState = {
  theme: "theme1",
  navMode: "multi", // 'single' | 'multi'
  logo: {}, // logo 需要上传，故需要记录，表单上传时使用；
  basicForm: {},
};

export const basicSetupSlice = createSlice({
  name: "basicSetup",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setMode: (state, action: PayloadAction<"single" | "multi">) => {
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

export default basicSetupSlice.reducer;

export const selectTheme = (state: RootState) => state.basicSetup.theme;

export const selectNavMode = (state: RootState) => state.basicSetup.navMode;

export const selectBasicForm = (state: RootState) => state.basicSetup.basicForm;

export const { setTheme, setMode, setBaseForm } = basicSetupSlice.actions;
