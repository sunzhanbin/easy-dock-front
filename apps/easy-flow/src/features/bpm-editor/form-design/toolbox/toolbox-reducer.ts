import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { values, reduce } from 'lodash';
import { RootState } from '@app/store';
import { fetchComponents } from './toolboxApi';

export const loadComponents = createAsyncThunk('formDesign/fetchComponents', async () => {
  const response = await fetchComponents();

  return response;
});

export const toolboxSelector = createSelector(
  [
    (state: RootState) => {
      return state.formDesign.schema;
    },
  ],
  (schema) => {
    const tools = values(schema);
    return reduce(
      tools,
      (memo: any, tool) => {
        if (!memo[tool!.baseInfo.category]) {
          memo[tool!.baseInfo.category] = [];
        }
        memo[tool!.baseInfo.category].push(tool?.baseInfo);
        return memo;
      },
      {},
    );
  },
);

const reducers = {};

export default reducers;
