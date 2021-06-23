import React, { Suspense, useEffect, useMemo } from 'react';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '@components/header';
import Loading from '@components/loading';
import { getUserInfo } from '@/store/user';
import { ROUTES, micros } from '@consts';
import { RootState } from '@/store';

const ScenesListPage = React.lazy(() => import(/* webpackChunkName: "scenes-list" */ '@/routes/scenes/main'));

const AppPage = React.lazy(() => import(/* webpackChunkName: "app-detail" */ '@/routes/app-detail'));
const IntegrationPage = React.lazy(() => import(/* webpackChunkName: "integration" */ '@/routes/integration'));

const MicroPage = React.lazy(() => import(/* webpackChunkName: "micro" */ '@/routes/micro-page'));

// 运行端应用列表
const AppsRuntimePage = React.lazy(() => import(/* webpackChunkName: "apps" */ '@/routes/runtime/apps'));

export default function PrimaryLayout() {
  const dispatch = useDispatch();
  const { showHeader } = useSelector((state: RootState) => state.layout);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const fallback = useMemo(() => <Loading />, []);

  // 注册微应用的路由
  const microsUrls = useMemo(() => {
    return micros.map((micro) => micro.route);
  }, []);

  return (
    <>
      {showHeader && <Header />}

      <Suspense fallback={fallback}>
        <Route path={ROUTES.SCENE_MANAGE} exact component={ScenesListPage}></Route>
        <Route path={ROUTES.SCENE_DETAIL} component={AppPage}></Route>
        <Route path={ROUTES.INTEGRATION} component={IntegrationPage}></Route>
        <Route path={ROUTES.INDEX} exact component={AppsRuntimePage}></Route>
        <Route path={microsUrls} component={MicroPage}></Route>
      </Suspense>
    </>
  );
}
