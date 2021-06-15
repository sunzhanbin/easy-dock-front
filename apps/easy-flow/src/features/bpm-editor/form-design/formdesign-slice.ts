import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  comAdded as addedReducer,
  moveDown as moveDownReducer,
  moveRow as moveRowReducer,
  moveUp as moveUpReducer,
  exchange as exchangeReducer,
  selectField as selectFieldReducer,
  editProps as editPropsReducer,
  comDeleted as comDeletedReducer,
  setAppInfo as setAppInfoReducer,
  setLayout as setLayoutReducer,
  setById as setByIdReducer,
  setIsDirty as setIsDirtyReducer,
} from './formzone-reducer';
import { ConfigItem, FieldType, FormDesign, FormMeta } from '@/type';
import { loadComponents } from './toolbox/toolbox-reducer';
import { RootState } from '@/app/store';
import { axios } from '@/utils';
import { message } from 'antd';

let initialState: FormDesign = {} as FormDesign;

const formDesign = createSlice({
  name: 'formDesign',
  initialState,
  reducers: {
    comAdded: addedReducer,
    comDeleted: comDeletedReducer,
    moveDown: moveDownReducer,
    moveRow: moveRowReducer,
    moveUp: moveUpReducer,
    exchange: exchangeReducer,
    selectField: selectFieldReducer,
    editProps: editPropsReducer,
    setAppInfo: setAppInfoReducer,
    setLayout: setLayoutReducer,
    setById: setByIdReducer,
    setIsDirty: setIsDirtyReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(loadComponents.fulfilled, (state, action) => {
      state.schema = action.payload;
      state.isDirty = false;
    });
  },
});

export const {
  comAdded,
  comDeleted,
  moveDown,
  moveRow,
  moveUp,
  exchange,
  selectField,
  editProps,
  setAppInfo,
  setLayout,
  setById,
  setIsDirty,
} = formDesign.actions;

export default formDesign.reducer;

const validComponentConfig = (config: ConfigItem) => {
  const label = config.label || '';
  const reg = /[a-zA-Z]+[a-zA-Z0-9_]*/;
  let errorText = '';
  Object.keys(config).forEach((key: string) => {
    if (key === 'fieldName') {
      errorText = config.fieldName
        ? reg.test(config.fieldName as string)
          ? ''
          : `${label}的数据库字段名不符合规范`
        : `请填写${label}的数据库字段名`;
    } else if (key === 'label' && !config.label) {
      errorText = `请填写控件名称`;
    }
  });
  return errorText;
};

export const saveForm = createAsyncThunk<void, string, { state: RootState }>(
  'form/save',
  async (subAppId: string, { getState, dispatch }) => {
    const { formDesign } = getState();
    const { layout, schema, isDirty } = formDesign;
    const formMeta: FormMeta = {
      components: [],
      layout: layout,
      schema: schema,
    };
    const errors: string[] = [];
    const { byId } = formDesign;
    Object.keys(byId).forEach((id) => {
      const type = id.split('_')[0] || '';
      const version = schema[type as FieldType]?.baseInfo.version || '';
      const componentConfig = schema[type as FieldType]?.config;
      const config: ConfigItem = { id, type, version, rules: [], canSubmit: type === 'DescText' ? false : true };
      const props: ConfigItem = {};
      componentConfig?.forEach(({ isProps, key }) => {
        if (isProps) {
          props[key] = (byId[id] as any)[key];
        } else {
          config[key] = (byId[id] as any)[key];
        }
      });
      const errorText = validComponentConfig(config);
      if (errorText) {
        errors.push(errorText);
      }
      formMeta.components.push({ config, props });
    });
    try {
      if (errors.length > 0) {
        message.error(errors.toString());
        return;
      }
      // 表单改变之后才有必要调后台接口
      if (isDirty) {
        await axios.post('/form', { meta: formMeta, subappId: subAppId });
        dispatch(setIsDirty({ isDirty: false }));
      }
      message.success('保存成功!');
    } catch (error) {}
  },
);
