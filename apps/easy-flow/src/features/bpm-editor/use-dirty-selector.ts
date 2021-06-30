import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

export default createSelector(
  [(state: RootState) => state.formDesign.isDirty, (state: RootState) => state.flow.dirty],
  (formDirty, flowDirty) => {
    return formDirty || flowDirty;
  },
);
