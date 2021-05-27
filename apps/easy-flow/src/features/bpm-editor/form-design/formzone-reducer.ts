import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { FieldType, FormDesign, FormField, TConfigItem, TConfigMap } from '@type';
import { RootState } from '@/app/store';

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
      if (!state.byId) {
        state.byId = {}
      }
      if (!state.layout) {
        state.layout = [];
      }
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
  comDeleted(state: FormDesign, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    let [row, col] = locateById(id, state.layout);
    if (state.layout[row].length === 1) {
      state.layout.splice(row, 1);
    } else {
      state.layout[row].splice(col, 1);
    }
    if (id === state.selectedField) {
      state.selectedField = null;
    }
    return state;
  },
  moveRow(state: FormDesign, action: PayloadAction<{ sourceIndex: number; targetIndex: number }>) {
    const { sourceIndex, targetIndex } = action.payload;
    console.info(sourceIndex, targetIndex);
    if (sourceIndex > targetIndex) {
      state.layout.splice(targetIndex, 0, state.layout[sourceIndex]);
      state.layout.splice(sourceIndex + 1, 1);
    } else {
      const target = state.layout[sourceIndex];
      state.layout.splice(sourceIndex, 1);
      state.layout.splice(targetIndex, 0, target);
    }
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
    state.layout.splice(row, 1, rowLayout);
    state.layout.splice(row + 1, 0, [id]);
    return state;
  },
  //exchnage with the com on the left
  exchange(state: FormDesign, action: PayloadAction<{ id: string, direction: string }>) {
    let [row, col] = locateById(action.payload.id, state.layout);
    const { direction } = action.payload
    if (row === -1 || col === -1) return state;
    let rowLayout = state.layout[row];
    if (direction === 'left') {
      state.layout[row].splice(col - 1, 2, rowLayout[col], rowLayout[col - 1]);
    }
    if (direction === 'right') {
      state.layout[row].splice(col, 2, rowLayout[col + 1], rowLayout[col]);
    }
    return state;
  },
  selectField(state: FormDesign, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    state.selectedField = id;
    return state;
  },
  editProps(state: FormDesign, action: PayloadAction<{ id: string, config: TConfigItem }>) {
    const { id, config } = action.payload;
    state.byId[id] = (config as FormField);
    return state;
  }
};

export const configSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign.schema;
    },
  ],
  (schema) => {
    let config: TConfigMap = {};
    if (!schema) {
      return config;
    }
    const keys: string[] = Object.keys(schema);
    keys.forEach((key) => {
      const configItem: TConfigItem = { type: schema[(key as FieldType)]?.baseInfo.type };
      schema[(key as FieldType)]?.config.forEach(({ key, defaultValue }) => {
        configItem[key] = defaultValue;
      })
      config[(key as FieldType)] = configItem;
    })
    return config;
  },
);

export const selectedFieldSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign;
    },
  ],
  (formDesign) => {
    return formDesign.selectedField || '';
  }
)

export const layoutSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign;
    },
  ],
  (formDesign) => {
    return formDesign.layout || [];
  }
)
export const componentPropsSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign;
    },
  ],
  (formDesign) => {
    return formDesign.byId || {};
  }
)

export const { comAdded, comDeleted, moveRow, moveDown, moveUp, exchange, selectField, editProps } = reducers;
