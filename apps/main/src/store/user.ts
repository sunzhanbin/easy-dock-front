import cookie from 'js-cookie';
import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { runtimeAxios } from '@utils';
import Auth from '@enc/sso';

import type { RootState } from './index';

type UserState = {
  loading: false;
  info: User | null;
};

let initialState: UserState = {
  loading: false,
  info: null,
};

const user = createSlice({
  name: 'main-app-user',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User>) {
      state.info = payload;
    },
    clear(state) {
      state.info = null;
    },
  },
});

export const getUserInfo = createAsyncThunk('main-app-user/get-user', (_, { dispatch }) => {
  runtimeAxios.get('/auth/current', { silence: true }).then(({ data }) => {
    dispatch(
      setUser({
        avatar: data.user.avatar,
        username: data.user.userName,
        id: data.user.id,
        power: data.power,
      }),
    );
  });
});

export const logout = createAsyncThunk<void, string | undefined, { state: RootState }>(
  'main-app-user/logout',
  async (url, { dispatch }) => {
    debugger
    // await runtimeAxios.delete('/auth/logout');
    if (window.Auth) {
      window.Auth.logout(url ? url : undefined);
    } else {
      Auth.logout(url ? url : undefined);
    }

    // 删除请求头里的auth
    delete runtimeAxios.defaults.headers.auth;

    // 清掉cookie
    cookie.remove('token');

    dispatch(clear());
  },
);

export default user.reducer;

export const { setUser, clear } = user.actions;

export const userSelector = createSelector([(state: RootState) => state.user], (user) => user);
