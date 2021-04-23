import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Route } from 'react-router-dom';
import Header from '@components/header';
import Loading from '@components/loading';
import useMatchRoute from '@hooks/use-match-route';
import { UserContext } from '@/context';
import { axios } from '@utils';

const HomePage = React.lazy(() => import(/* webpackChunkName: "home" */ '@routes/home/main'));
const ScenePage = React.lazy(() => import(/* webpackChunkName: "scene" */ '@/routes/scene-detail'));
const IntegrationPage = React.lazy(() => import(/* webpackChunkName: "scene" */ '@/routes/integration'));

export default function PrimaryLayout() {
  const mathedRoute = useMatchRoute();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios
      .get('/api/auth/v1/user/currentInfo', {
        baseURL: process.env.REACT_APP_LOGIN_DOMAIN,
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
        <Route path={[`${mathedRoute}/`, `${mathedRoute}/scenes`]} exact component={HomePage}></Route>
        <Route path={`${mathedRoute}/scenes/:sceneId`} component={ScenePage}></Route>
        <Route path={`${mathedRoute}/integration`} component={IntegrationPage}></Route>
      </Suspense>
    </UserContext.Provider>
  );
}
