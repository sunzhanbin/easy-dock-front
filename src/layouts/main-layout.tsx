import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import Header from '@components/header';
import Loading from '@components/loading';
import { UserContext } from '@/context';
import { axios } from '@utils';
import { ROUTES, envs } from '@consts';

const ScenesListPage = React.lazy(() => import(/* webpackChunkName: "scenes-list" */ '@/routes/scenes/main'));
const ScenePage = React.lazy(() => import(/* webpackChunkName: "scene-detail" */ '@/routes/scene-detail'));
const IntegrationPage = React.lazy(() => import(/* webpackChunkName: "integration" */ '@/routes/integration'));

export default function PrimaryLayout() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios
      .get('/api/auth/v1/user/currentInfo', {
        baseURL: envs.REACT_APP_LOGIN_DOMAIN,
        silence: true,
      })
      .then(({ data }) => {
        const user = data.userInfo.find((user: any) => user.userId === data.id);

        if (!user) return;

        setUser({
          avatar: user.staffPhoto,
          id: user.id,
          nick: user.username,
          email: user.email,
          cName: user.cnName,
        });
      });
  }, []);

  const fallback = useMemo(() => <Loading />, []);

  return (
    <UserContext.Provider value={user}>
      <Header />
      <Suspense fallback={fallback}>
        <Route path={[ROUTES.INDEX, ROUTES.SCENE_MANAGE]} exact component={ScenesListPage}></Route>
        <Route path={ROUTES.SCENE_DETAIL} component={ScenePage}></Route>
        <Route path={ROUTES.INTEGRATION} component={IntegrationPage}></Route>
      </Suspense>
    </UserContext.Provider>
  );
}
