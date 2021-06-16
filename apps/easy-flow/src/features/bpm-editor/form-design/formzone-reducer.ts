import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash';
import { FieldType, FormDesign, FormField, FormFieldMap, TConfigItem, TConfigMap } from '@type';
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
        state.byId = {};
      }
      if (!state.layout) {
        state.layout = [];
      }
      if (state.byId[com.id!]) return state;
      state.byId[com.id!] = com;
      // 如果当前选中了某一行，则在当前行之后插入；否则在末尾插入
      if (state.selectedField) {
        const rowNumber = locateById(state.selectedField, state.layout)[0];
        state.layout.splice(rowNumber + 1, 0, [com.id!]);
      } else {
        state.layout.splice(rowIndex, 0, [com.id!]);
      }
      state.isDirty = true;
      state.selectedField = com.id as string;
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
    delete state.byId[id];
    if (id === state.selectedField) {
      state.selectedField = null;
    }
    state.isDirty = true;
    return state;
  },
  moveRow(state: FormDesign, action: PayloadAction<{ sourceIndex: number; targetIndex: number }>) {
    const { sourceIndex, targetIndex } = action.payload;
    if (sourceIndex > targetIndex) {
      state.layout.splice(targetIndex, 0, state.layout[sourceIndex]);
      state.layout.splice(sourceIndex + 1, 1);
    } else {
      const target = state.layout[sourceIndex];
      state.layout.splice(sourceIndex, 1);
      state.layout.splice(targetIndex, 0, target);
    }
    state.isDirty = true;
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
    state.isDirty = true;
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
    state.isDirty = true;
    return state;
  },
  //exchnage with the com on the left
  exchange(state: FormDesign, action: PayloadAction<{ id: string; direction: string }>) {
    let [row, col] = locateById(action.payload.id, state.layout);
    const { direction } = action.payload;
    if (row === -1 || col === -1) return state;
    let rowLayout = state.layout[row];
    if (direction === 'left') {
      state.layout[row].splice(col - 1, 2, rowLayout[col], rowLayout[col - 1]);
    }
    if (direction === 'right') {
      state.layout[row].splice(col, 2, rowLayout[col + 1], rowLayout[col]);
    }
    state.isDirty = true;
    return state;
  },
  selectField(state: FormDesign, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    state.selectedField = id;
    return state;
  },
  editProps(state: FormDesign, action: PayloadAction<{ id: string; config: TConfigItem; isEdit?: boolean }>) {
    const { id, config, isEdit } = action.payload;
    state.byId[id] = config as FormField;
    // 如果改变控件宽度后导致整行的宽度大于100%,则需要改变layout布局以实现换行
    if (isEdit) {
      const [rowIndex, colIndex] = locateById(id, state.layout);
      const idList: string[] = [...state.layout[rowIndex]];
      if (Number(state.byId[id].colSpace) === 4 && state.layout[rowIndex].length > 1) {
        if (colIndex === 0) {
          const id: string = idList.shift() as string;
          state.layout[rowIndex] = [id];
          state.layout.splice(rowIndex + 1, 0, idList);
        } else {
          const prevRow = idList.slice(0, colIndex);
          const currentRow = [id];
          const nextRow = idList.slice(colIndex + 1);
          state.layout.splice(rowIndex, 1, prevRow, currentRow, nextRow);
        }
        return state;
      }
      let sum = 0;
      for (let i = 0, len = idList.length; i < len; i++) {
        sum += Number(state.byId[idList[i]].colSpace);
      }
      if (sum > 4) {
        state.layout.splice(rowIndex + 1, 0, []);
      }
      while (sum > 4) {
        const id: string = idList.pop() as string;
        sum -= Number(state.byId[id].colSpace);
        state.layout[rowIndex].pop();
        state.layout[rowIndex + 1].unshift(id);
      }
    }
    state.isDirty = true;
    return state;
  },
  setAppInfo(state: FormDesign, action: PayloadAction<{ id: string | number; appId: string | number; name: string }>) {
    const { id, name, appId } = action.payload;
    state.subAppInfo = { id, name, appId };
    return state;
  },
  setLayout(state: FormDesign, action: PayloadAction<{ layout: string[][] }>) {
    const { layout } = action.payload;
    state.layout = layout;
    return state;
  },
  setById(state: FormDesign, action: PayloadAction<{ byId: FormFieldMap }>) {
    const { byId } = action.payload;
    state.byId = byId;
    return state;
  },
  setIsDirty(state: FormDesign, action: PayloadAction<{ isDirty: boolean }>) {
    const { isDirty } = action.payload;
    state.isDirty = isDirty;
    return state;
  },
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
      const configItem: TConfigItem = { type: schema[key as FieldType]?.baseInfo.type };
      schema[key as FieldType]?.config.forEach(({ key, defaultValue }) => {
        configItem[key] = defaultValue;
      });
      config[key as FieldType] = configItem;
    });
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
  },
);

export const layoutSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign;
    },
  ],
  (formDesign) => {
    return formDesign.layout || [];
  },
);
export const componentPropsSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign;
    },
  ],
  (formDesign) => {
    return formDesign.byId || {};
  },
);
export const subAppSelector = createSelector([(state: RootState) => state.formDesign], (formDesign) => {
  return formDesign.subAppInfo || { name: '', id: '' };
});
export const dirtySelector = createSelector([(state: RootState) => state.formDesign], (formDesign) => {
  return formDesign.isDirty;
});

export const {
  comAdded,
  comDeleted,
  moveRow,
  moveDown,
  moveUp,
  exchange,
  selectField,
  editProps,
  setAppInfo,
  setLayout,
  setById,
  setIsDirty,
} = reducers;
