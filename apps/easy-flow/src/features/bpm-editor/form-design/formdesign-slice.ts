import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@app/store';
import {
  comAdded as addedReducer,
  moveDown as moveDownReducer,
  moveRow as moveRowReducer,
  moveUp as moveUpReducer,
  exchange as exchangeReducer,
} from './formzone-reducer';
import { FormDesign } from '@/type';
import { loadComponents } from './toolbox-reducer';

let initialState: FormDesign = {} as FormDesign;

const formDesign = createSlice({
  name: 'formDesign',
  initialState,
  reducers: {
    comAdded: addedReducer,
    moveDown: moveDownReducer,
    moveRow: moveRowReducer,
    moveUp: moveUpReducer,
    exchange: exchangeReducer,
  },
  extraReducers: (builder) => {
    builder.addCase(loadComponents.fulfilled, (state, action) => {
      state.schema = action.payload;
    });
  },
});

export const { comAdded, moveDown, moveRow, moveUp } = formDesign.actions;

export default formDesign.reducer;
