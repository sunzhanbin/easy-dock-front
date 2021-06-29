import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  comAdded as addedReducer,
  comInserted as insertedReducer,
  moveDown as moveDownReducer,
  moveRow as moveRowReducer,
  moveUp as moveUpReducer,
  moveIndex as moveIndexReducer,
  exchange as exchangeReducer,
  selectField as selectFieldReducer,
  editProps as editPropsReducer,
  comDeleted as comDeletedReducer,
  setAppInfo as setAppInfoReducer,
  setLayout as setLayoutReducer,
  setById as setByIdReducer,
  setIsDirty as setIsDirtyReducer,
  setErrors as setErrorsReducer,
} from './formzone-reducer';
import { ConfigItem, ErrorItem, FieldType, FormDesign, FormMeta } from '@/type';
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
    comInserted: insertedReducer,
    comDeleted: comDeletedReducer,
    moveDown: moveDownReducer,
    moveRow: moveRowReducer,
    moveUp: moveUpReducer,
    moveIndex: moveIndexReducer,
    exchange: exchangeReducer,
    selectField: selectFieldReducer,
    editProps: editPropsReducer,
    setAppInfo: setAppInfoReducer,
    setLayout: setLayoutReducer,
    setById: setByIdReducer,
    setIsDirty: setIsDirtyReducer,
    setErrors: setErrorsReducer,
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
  comInserted,
  comDeleted,
  moveDown,
  moveRow,
  moveUp,
  moveIndex,
  exchange,
  selectField,
  editProps,
  setAppInfo,
  setLayout,
  setById,
  setIsDirty,
  setErrors,
} = formDesign.actions;

export default formDesign.reducer;

const validComponentConfig = (config: ConfigItem) => {
  const label = config.label || '';
  const reg = /^[a-zA-Z][a-zA-Z0-9_]{0,29}$/;
  const errorItem: ErrorItem = { id: '', content: '' };
  const configKeys: string[] = Object.keys(config);
  for (let i = 0, len = configKeys.length; i < len; i++) {
    const key = configKeys[i];
    if (key === 'fieldName') {
      const errorText = config.fieldName
        ? reg.test(config.fieldName as string)
          ? ''
          : `${label}的数据库字段名不符合规范`
        : `请填写${label}的数据库字段名`;
      if (errorText) {
        errorItem.id = config.id as string;
        errorItem.content = errorText;
        break;
      }
    } else if (key === 'label' && !config.label) {
      errorItem.id = config.id as string;
      errorItem.content = '请输入控件名称';
      break;
    }
  }
  return errorItem.id ? errorItem : null;
};
type SaveParams = {
  subAppId: string;
  isShowTip?: boolean;
  isShowErrorTip?: boolean;
};
export const saveForm = createAsyncThunk<void, SaveParams, { state: RootState }>(
  'form/save',
  async ({ subAppId, isShowTip, isShowErrorTip }, { getState, dispatch }) => {
    const { formDesign } = getState();
    const { layout, schema, isDirty, byId = {} } = formDesign;
    const formMeta: FormMeta = {
      components: [],
      layout: layout,
      schema: schema,
    };
    const errors: ErrorItem[] = [];
    layout.forEach((row) => {
      row.forEach((id: string) => {
        const type = id.split('_')[0] || '';
        const version = schema[type as FieldType]?.baseInfo.version || '';
        const componentConfig = schema[type as FieldType]?.config;
        const config: ConfigItem = {
          id,
          type,
          version,
          rules: [],
          canSubmit: type === 'DescText' ? false : true,
          multiple: type === 'Checkbox' || (type === 'Select' && (byId[id] as any).multiple) ? true : false,
        };
        const props: ConfigItem = {};
        componentConfig?.forEach(({ isProps, key }) => {
          if (isProps) {
            props[key] = (byId[id] as any)[key];
          } else {
            config[key] = (byId[id] as any)[key];
          }
        });
        const errorItem = validComponentConfig(config);
        if (errorItem) {
          errors.push(errorItem);
        }
        formMeta.components.push({ config, props });
      });
    });
    if (errors.length > 0) {
      const id = errors[0].id || '';
      id && dispatch(selectField({ id }));
      dispatch(setErrors({ errors }));
      isShowErrorTip && message.error('您有内容未填写或填写错误，请检查');
      return Promise.reject(errors);
    }
    // 表单改变之后才有必要调后台接口
    if (isDirty) {
      await axios.post('/form', { meta: formMeta, subappId: subAppId });
      dispatch(setIsDirty({ isDirty: false }));
    }
    isShowTip && message.success('保存成功!');
  },
);
