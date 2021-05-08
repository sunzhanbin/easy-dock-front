import { initGlobalState, MicroAppStateActions } from 'qiankun';

export const actions: MicroAppStateActions = initGlobalState({});

export const setUser = (user: User) => {
  actions.setGlobalState({ user });
};
