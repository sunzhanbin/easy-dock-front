import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentType, InitialStateType } from './types';
// import schema from '@components/schema';

const initialState: InitialStateType = {
  curComponentData: {
    isMobile: false,
    id: '',
    type: '',
    pos: [0, 0],
    permission: '',
  },
  componentList: []
};
const componentConfig = createSlice({
  name: 'editComponent',
  initialState,
  reducers: {
    addComponent(state, { payload }: PayloadAction<ComponentType>) {
      const componentList = [...state.componentList, payload];
      // todo 组装面板属性配置editableEl
      // const editableEl = schema[payload.type].editData;
      state = {
        ...state,
        componentList,
        curComponentData: {...payload }
        // curComponentData: {...payload, editableEl }}
      };
    },
    editComponent(state, { payload }: PayloadAction<ComponentType>) {
      const { id } = payload;
      const componentList = state.componentList.map((item) => {
        if(item.id === id) {
          return payload;
        }
        return { ...item };
      });
      // todo 组装editableEl
      // const editableEl = schema[payload.type].editData
      state = {
        ...state,
        componentList,
        curComponentData: {...payload }
        // curComponentData: {...payload, editableEl}
      };
    },
    deleteComponent(state, { payload }: PayloadAction<ComponentType>) {
      const { id } = payload;
      const componentList = state.componentList.filter(item => item.id !== id);
      state = {
        ...state,
        componentList,
        curComponentData: null
      };
    },
    copyComponent(state, { payload }: PayloadAction<ComponentType>) {
      const { id } = payload;
      const componentList: ComponentType[] = [];
      state.componentList.forEach(item => {
        componentList.push({ ...item });
        if(item.id === id) {
          componentList.push({ ...item, id: new Date().getTime() });
        }
      });
      state = {
        ...state,
        componentList
      };
    },
  }
});

// todo getComponentList
export const loadComponents = createAsyncThunk('getComponentList', async () => {
  // return await getComponentList();
});
export default componentConfig.reducer;
