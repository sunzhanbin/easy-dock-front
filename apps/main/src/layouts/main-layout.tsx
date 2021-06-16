import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '@components/header';
import Loading from '@components/loading';
import { UserContext } from '@/context';
import { axios } from '@utils';
import { ROUTES, envs, micros } from '@consts';
import { RootState } from '@/store';

const ScenesListPage = React.lazy(() => import(/* webpackChunkName: "scenes-list" */ '@/routes/scenes/main'));
// const ScenePage = React.lazy(() => import(/* webpackChunkName: "scene-detail" */ '@/routes/scene-detail'));
const AppPage = React.lazy(() => import(/* webpackChunkName: "app-detail" */ '@/routes/app-detail'));
const IntegrationPage = React.lazy(() => import(/* webpackChunkName: "integration" */ '@/routes/integration'));

const MicroPage = React.lazy(() => import(/* webpackChunkName: "micro" */ '@/routes/micro-page'));

export default function PrimaryLayout() {
  const [user, setUser] = useState<User>();
  const { showHeader } = useSelector((state: RootState) => state.layout);

  useEffect(() => {
    axios
      .get('/api/auth/v1/user/currentInfo', {
        baseURL: envs.COMMON_LOGIN_DOMAIN,
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

  // 注册微应用的路由
  const microsUrls = useMemo(() => {
    return micros.map((micro) => micro.route);
  }, []);

  return (
    <UserContext.Provider value={user}>
      {showHeader && <Header />}

      <Suspense fallback={fallback}>
        <Route path={[ROUTES.INDEX, ROUTES.SCENE_MANAGE]} exact component={ScenesListPage}></Route>
        <Route path={ROUTES.SCENE_DETAIL} component={AppPage}></Route>
        <Route path={ROUTES.INTEGRATION} component={IntegrationPage}></Route>
        <Route path={microsUrls} component={MicroPage}></Route>
      </Suspense>
    </UserContext.Provider>
  );
}
