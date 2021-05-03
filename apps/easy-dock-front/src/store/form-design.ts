import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqueId } from "lodash";
type BaseField = {
  id: string;
  title: string;
  desc?: string;
  required: boolean;
  colSpace?: 1 | 2 | 3 | 4;
  defaultValue?: string | number;
  disabled: boolean;
  value?: string | number;
};

type AppBindField = {
  type: "app";
  appId: string;
  fieldId: string;
};

type CustomField = {
  type: "custom";
  data: FieldOption[];
};

type FieldValueSource = CustomField | AppBindField;

type FieldOption = {
  readonly value: string;
  text: string;
  color?: string;
};

type FormLogicItem = {
  optionId: string;
  fields: string[];
};

type FormLogic = {
  type: "visible";
  fields: {
    [k: string]: FormLogicItem;
  };
};

type DataBaseField = {
  datasource: FieldValueSource;
};

type InputBaseField = {
  placeholder: string;
  maxLength: number;
  allowClear: boolean;
  bordered: boolean;
} & BaseField;

type SingleTextField = {
  type: "Input";
  prefix?: string;
  suffix?: string;
  reg?: string;
} & InputBaseField;

type MultipleTextField = { type: "Input.TextArea"; showCount: boolean } & InputBaseField;

type SelectBaseField = {
  logic: FormLogic[];
} & DataBaseField &
  BaseField;

type SelectField = {
  type: "Select";
  mode: "multipe" | "tag";
  allowClear: boolean;
  showArrow: boolean;
  showSearch: boolean;
} & SelectBaseField;

type FormField = SingleTextField | MultipleTextField | SelectField;

type FormFieldMap = {
  [k: string]: FormField;
};

type FormDesign = { byId: FormFieldMap; layout: string[][] };

let initialState: FormDesign = {} as FormDesign;

const formDesign = createSlice({
  name: "formDesign",
  initialState,
  reducers: {
    comAdded: {
      reducer: (state, action: PayloadAction<{ com: FormField; rowIndex: number }>) => {
        const { com, rowIndex } = action.payload;
        if (state.byId[com.id]) return state;
        state.byId[com.id] = com;
        state.layout.splice(rowIndex, 0, [com.id]);
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
    move(state, action: PayloadAction<{ id: string; sourceIndex: number; targetIndex: number }>) {
      const { id, sourceIndex, targetIndex } = action.payload;
      if (!state.byId[id]) return state;
      state.layout.splice(targetIndex, 0, [id]);
      let indexToDelete = sourceIndex > targetIndex ? sourceIndex + 1 : sourceIndex;
      state.layout.splice(indexToDelete, 1);
      return state;
    },
    //exchnage with the com on the left
    exchange(state, action: PayloadAction<{ id: string }>) {
      let [row, col] = locateById(action.payload.id, state.layout);
      if (col === 0 || row === -1 || col === -1) return state;
      let rowLayout = state.layout[row];
      [rowLayout[col - 1], rowLayout[col]] = [rowLayout[col], rowLayout[col - 1]];
      return state;
    },
  },
  extraReducers: {},
});

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

export default formDesign.reducer;
