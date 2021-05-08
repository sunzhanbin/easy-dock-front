import { createSlice } from '@reduxjs/toolkit';
import {
  comAdded as addedReducer,
  moveDown as moveDownReducer,
  moveRow as moveRowReducer,
  moveUp as moveUpReducer,
  exchange as exchangeReducer,
} from './formzone-reducer';
import { FormDesign } from '@/types';

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
  extraReducers: {},
});

export const { comAdded, moveDown, moveRow, moveUp } = formDesign.actions;

export default formDesign.reducer;
