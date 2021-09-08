import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubAppState {
  loading: boolean;
}

const subapp = createSlice({
  name: 'subapp',
  initialState: { loading: false } as SubAppState,
  reducers: {
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
  },
});

export const { setLoading } = subapp.actions;



export default subapp;

