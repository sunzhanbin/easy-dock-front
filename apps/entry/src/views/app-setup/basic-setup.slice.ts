import { NavModeType, ThemeType, validateName, validateRemark } from "@/consts";
import { appManagerBuilder } from "@/http";
import { RootState } from "@/store";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BasicSetupInitialState } from "@utils/types";

const initialState: BasicSetupInitialState = {
  theme: ThemeType.LIGHT,
  navMode: NavModeType.MULTI,
  logo: "", // logo 需要上传，故需要记录，表单上传时使用；
  basicForm: {},
  errors: [], //保存错误信息
};

export const basicSetupSlice = createSlice({
  name: "basicSetup",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    },
    setMode: (state, action: PayloadAction<NavModeType>) => {
      state.navMode = action.payload;
    },
    setLogo: (state, action: PayloadAction<string>) => {
      state.logo = action.payload;
    },
    setErrors: (state, action: PayloadAction<string[]>) => {
      state.errors = action.payload;
    },
    setBaseForm: (state, action: PayloadAction<{ [key: string]: any }>) => {
      const icon = action.payload.icon;
      if (typeof action.payload === "object") {
        state.basicForm = JSON.parse(JSON.stringify(action.payload));
      }
      if (icon) {
        state.basicForm.icon = icon;
      } else {
        state.basicForm.icon = null;
      }
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(appManagerBuilder.endpoints.workspaceDetail.matchFulfilled, (state, action) => {
      const extension = action.payload?.extension;
      if (!extension) {
        state.basicForm = {
          navMode: NavModeType.MULTI,
          theme: ThemeType.LIGHT,
        };
      } else {
        const { name, id, remark, navMode, theme, icon } = extension;
        const defaultNavMode = navMode || NavModeType.MULTI;
        const defaultTheme = theme || ThemeType.LIGHT;
        state.theme = defaultTheme;
        state.navMode = defaultNavMode;
        state.logo = icon;
        state.basicForm = {
          icon,
          name,
          remark,
          theme: defaultTheme,
          navMode: defaultNavMode,
          workspace: id,
        };
      }
    });
  },
});

export default basicSetupSlice.reducer;

export const selectTheme = (state: RootState) => state.basicSetup.theme;

export const selectNavMode = (state: RootState) => state.basicSetup.navMode;

export const selectBasicForm = (state: RootState) => state.basicSetup.basicForm;

export const basicErrorSelector = (state: RootState) => state.basicSetup.errors;

export const { setTheme, setMode, setLogo, setErrors, setBaseForm } = basicSetupSlice.actions;

// 校验基础表单,保存时需要校验
export const validateBasicForm = createAsyncThunk<
  void,
  { [k: string]: string | number | null | undefined },
  { state: RootState }
>("basicForm/save", async (basicConfig, { dispatch }) => {
  const errors: string[] = [];
  const { name, workspace, remark, icon } = basicConfig;
  const nameError = validateName(name as string);
  if (nameError) {
    errors.push("应用名称错误");
  }
  const remarkError = validateRemark(remark as string);
  if (remarkError) {
    errors.push("应用描述错误");
  }
  if (!workspace) {
    errors.push("请选择所属工作区");
  }
  if (!icon) {
    errors.push("请上传logo");
  }
  if (errors.length > 0) {
    dispatch(setErrors(errors));
    return Promise.reject(new Error("请检查应用设置!"));
  }
  return Promise.resolve();
});
