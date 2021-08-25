import { createSelector } from '@reduxjs/toolkit';

export default createSelector(
  [
    (state: RootState) => state.formDesign.isDirty,
    (state: RootState) => state.flow.dirty,
    (state: RootState) => state.subapp.dirty,
  ],
  (formDirty, flowDirty, extendDirty) => {
    return formDirty || flowDirty || extendDirty;
  },
);
