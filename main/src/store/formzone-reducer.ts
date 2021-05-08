import { PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { FormDesign, FormField } from '@/types';

function locateById(target: string, layout: Array<string[]>): [number, number] {
  let res: [number, number] = [-1, -1];
  for (let i = 0; i < layout.length; i++) {
    let row = layout[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === target) return [i, j];
    }
  }
  return res;
}

const reducers = {
  comAdded: {
    reducer: (state: FormDesign, action: PayloadAction<{ com: FormField; rowIndex: number }>) => {
      const { com, rowIndex } = action.payload;
      if (state.byId[com.id!]) return state;
      state.byId[com.id!] = com;
      state.layout.splice(rowIndex, 0, [com.id!]);
      return state;
    },
    prepare: (com: FormField, rowIndex: number) => {
      com.id = uniqueId(`${com.type}_`);
      return {
        payload: {
          rowIndex,
          com,
        },
      };
    },
  },
  moveRow(state: FormDesign, action: PayloadAction<{ sourceIndex: number; targetIndex: number }>) {
    const { sourceIndex, targetIndex } = action.payload;
    state.layout.splice(targetIndex, 0, [...state.layout[sourceIndex]]);
    let indexToDelete = sourceIndex > targetIndex ? sourceIndex + 1 : sourceIndex;
    state.layout.splice(indexToDelete, 1);
    return state;
  },
  moveUp(state: FormDesign, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    let [row, col] = locateById(id, state.layout);
    if (!state.byId[id] || row === 0) return state;
    let rowLayout = state.layout[row];
    let targetLayout = state.layout[row - 1];
    if (targetLayout.length >= 4) return state;
    rowLayout.splice(col, 1);
    targetLayout.push(id);
    if (rowLayout.length === 0) state.layout.splice(row, 1);
    return state;
  },
  moveDown(state: FormDesign, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    let [row, col] = locateById(id, state.layout);
    if (!state.byId[id]) return state;
    let rowLayout = state.layout[row];
    if (rowLayout.length === 1) return;
    rowLayout.splice(col, 1);
    state.layout.splice(row, 1);
    state.layout.splice(row + 1, 0, [id]);
    return state;
  },
  //exchnage with the com on the left
  exchange(state: FormDesign, action: PayloadAction<{ id: string }>) {
    let [row, col] = locateById(action.payload.id, state.layout);
    if (col === 0 || row === -1 || col === -1) return state;
    let rowLayout = state.layout[row];
    [rowLayout[col - 1], rowLayout[col]] = [rowLayout[col], rowLayout[col - 1]];
    return state;
  },
};

export const { comAdded, moveRow, moveDown, moveUp, exchange } = reducers;
