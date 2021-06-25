import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { axios } from '@utils';
import { envs } from '@consts';
import cookie from 'js-cookie';
import { localStorage } from '@common/utils';

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
  axios
    .get('/api/auth/v1/user/currentInfo', {
      baseURL: envs.COMMON_LOGIN_DOMAIN,
      silence: true,
    })
    .then(({ data }) => {
      const user = data.userInfo.find((user: any) => user.userId === data.id);

      if (!user) return;

      dispatch(
        setUser({
          avatar: user.staffPhoto,
          id: user.id,
          nick: user.username,
          email: user.email,
          cName: (user.cnName && user.cnName.trim()) || '',
          loginName: data.loginName,
        }),
      );
    });
});

export const logout = createAsyncThunk('main-app-user/logout', async (_, { dispatch }) => {
  await axios.get('/api/auth/v1/logout', {
    baseURL: envs.COMMON_LOGIN_DOMAIN,
  });

  // 删除请求头里的auth
  delete axios.defaults.headers.auth;

  // 清掉cookie
  localStorage.clear('token');

  // cookie.remove('token')

  dispatch(clear());
});

export default user.reducer;

export const { setUser, clear } = user.actions;

export const userSelector = createSelector([(state: RootState) => state.user], (user) => user);
