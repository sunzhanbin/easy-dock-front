import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { axios } from '@utils';
import { envs } from '@consts';
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
          cName: user.cnName,
        }),
      );
    });
});

export default user.reducer;

export const { setUser, clear } = user.actions;

export const userSelector = createSelector([(state: RootState) => state.user], (user) => user);
