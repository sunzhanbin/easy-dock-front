import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  comAdded as addedReducer,
  // comInserted as insertedReducer,
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
  setFormRules as setFormRulesReducer,
} from './formzone-reducer';
import { ConfigItem, ErrorItem, FieldType, FormDesign, FormField, FormMeta } from '@/type';
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
    comInserted: addedReducer,
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
    setFormRules: setFormRulesReducer,
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
  setFormRules,
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
        errorItem.id = config.id;
        errorItem.content = errorText;
        break;
      }
    } else if (key === 'label' && !config.label) {
      errorItem.id = config.id;
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
type Key = keyof FormField;
export const saveForm = createAsyncThunk<void, SaveParams, { state: RootState }>(
  'form/save',
  async ({ subAppId, isShowTip, isShowErrorTip }, { getState, dispatch }) => {
    const { formDesign } = getState();
    const { layout = [], schema = {}, isDirty = false, byId = {}, formRules } = formDesign;
    const formMeta: FormMeta = {
      components: [],
      layout: layout,
      schema: schema,
      formRules,
    };
    const errors: ErrorItem[] = [];
    // 组装控件属性
    layout.forEach((row) => {
      row.forEach((id: string) => {
        const type = <FieldType>(id.split('_')[0] || '');
        const version = schema[type]?.baseInfo.version || '';
        const componentConfig =
          type === 'DescText'
            ? schema[type]?.config.concat([{ key: 'fieldName', type: 'Input', isProps: false }]) //富文本也要保存fieldName
            : schema[type]?.config;
        const config: ConfigItem = {
          id,
          type,
          version,
          rules: [],
          canSubmit: type !== 'DescText',
          multiple: type === 'Checkbox' || (type === 'Select' && byId[id].multiple),
        };

        const props: ConfigItem = { type, id };
        componentConfig?.forEach(({ isProps, key }) => {
          if (isProps) {
            props[key] = byId[id][key as Key];
          } else {
            config[key] = byId[id][key as Key];
            if (key === 'colSpace' && (type === 'Image' || type === 'Attachment')) {
              props[key] = byId[id][key as Key];
            }
          }
        });
        // 校验编辑的控件属性
        const errorItem = validComponentConfig(config);
        if (errorItem) {
          errors.push(errorItem);
        }
        formMeta.components.push({ config, props });
      });
    });
    // TODO 校验表单规则

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

export const moveUpAction = createAsyncThunk<void, { id: string; rowIndex: number }, { state: RootState }>(
  'component/moveUp',
  async ({ id, rowIndex }, { getState, dispatch }) => {
    dispatch(moveUp({ id }));
    const { formDesign } = getState();
    const rowList = formDesign.layout;
    const componentMap = formDesign.byId;
    const currentRow = rowList[rowIndex - 1];
    const nextRow = rowList[rowIndex];
    // 当前行重新布局
    currentRow.forEach((id) => {
      const config = Object.assign({}, componentMap[id], { colSpace: currentRow.length === 2 ? '2' : '1' });
      dispatch(editProps({ id, config }));
    });
    // 如果有下一行，重新布局
    nextRow &&
      nextRow.forEach((id) => {
        const config = Object.assign({}, componentMap[id], {
          colSpace: nextRow.length === 1 ? '4' : nextRow.length === 2 ? '2' : '1',
        });
        dispatch(editProps({ id, config }));
      });
  },
);
export const moveDownAction = createAsyncThunk<void, { id: string; rowIndex: number }, { state: RootState }>(
  'component/moveUp',
  async ({ id, rowIndex }, { getState, dispatch }) => {
    dispatch(moveDown({ id }));
    const { formDesign } = getState();
    const rowList = formDesign.layout;
    const componentMap = formDesign.byId;
    const componentIdList = rowList[rowIndex];
    const length = componentIdList.length;
    // 当前行重新布局
    componentIdList.forEach((id) => {
      const config = Object.assign({}, componentMap[id], { colSpace: length === 1 ? '4' : length === 2 ? '2' : '1' });
      dispatch(editProps({ id, config }));
    });
    // 下移之后一定是独占一行
    dispatch(editProps({ id, config: Object.assign({}, componentMap[id], { colSpace: '4' }) }));
  },
);
