import React, { Suspense, useEffect, useMemo } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import Header from '@components/header';

const HomePage = React.lazy(() => import(/* webpackChunkName: "home" */ '@routes/home'));
const ScenePage = React.lazy(() => import(/* webpackChunkName: "scene" */ '@routes/scene'));

export default function PrimaryLayout() {
  const match = useRouteMatch();
  const path = useMemo(() => {
    return match.path.replace(/\/$/, '');
  }, [match.path]);

  useEffect(() => {}, []);

  return (
    <div>
      <Header></Header>
      <Suspense fallback={<div>loading</div>}>
        <Route path={`${path}/`} exact component={HomePage}></Route>
        <Route path={`${path}/scene/:sceneId`} component={ScenePage}></Route>
      </Suspense>
    </div>
  );
}
