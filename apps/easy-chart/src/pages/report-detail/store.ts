import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ComponentClass, InitialStateType} from './types';
// import schema from '@components/schema';

const initialState: InitialStateType = {
  currentSelectId: '',
  componentList: {}
};
const componentConfig = createSlice({
  name: 'editComponent',
  initialState,
  reducers: {
    addComponent(state, { payload }: PayloadAction<ComponentClass>) {
      const { id } = payload;
      // todo 组装面板属性配置editData
      // const { editData } = schema[payload.type];
      // const componentList = {...state.componentList, [payload.id]: {...payload, editData}};
      state.currentSelectId = id as string;
      state.componentList = {...state.componentList, [id]: {...payload}};
    },
    // editComponent(state, { payload }: PayloadAction<ComponentClass>) {
    //   const { id } = payload;
    //   state.currentSelectId = id as string;
    //   state.componentList = {...state.componentList, [id]: {...payload}};
    // },
    deleteComponent(state, { payload }: PayloadAction<ComponentClass>) {
      // const { id } = payload;
      // delete state.componentList[id];
    },
    copyComponent(state, { payload }: PayloadAction<ComponentClass>) {
      const generateId = new Date().getTime().toString();
      state.currentSelectId = generateId;
      state.componentList = {...state.componentList, [generateId]: {...payload, id: generateId}};
    },
  }
});

export const {
  addComponent,
  editComponent,
  deleteComponent,
  copyComponent
} = componentConfig.actions;

// todo getComponentList
export const getComponentList = createAsyncThunk('getComponentList', async () => {
  // return await getComponentList();
});
export default componentConfig.reducer;
