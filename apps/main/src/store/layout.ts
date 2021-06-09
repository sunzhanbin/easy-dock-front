import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  showHeader: true,
};

const layout = createSlice({
  name: 'main-app-layout',
  initialState,
  reducers: {
    toggleHeader(state, { payload: visible }: PayloadAction<boolean>) {
      state.showHeader = visible;

      return state;
    },
  },
});

export default layout.reducer;

export const { toggleHeader } = layout.actions;
