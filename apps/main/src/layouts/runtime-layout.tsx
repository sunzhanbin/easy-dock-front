import React, { memo, Suspense, useMemo, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loading } from '@common/components';
import Header from '@components/header';
import { getUserInfo } from '@/store/user';
import { ROUTES } from '@consts';

const AppsRuntimePage = React.lazy(() => import(/* webpackChunkName: "apps" */ '@/routes/runtime/apps'));

function RuntimeLayout() {
  const dispatch = useDispatch();
  const fallback = useMemo(() => <Loading />, []);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  return (
    <>
      <Header />

      <Suspense fallback={fallback}>
        <Route path={ROUTES.INDEX} exact component={AppsRuntimePage}></Route>
      </Suspense>
    </>
  );
}

export default memo(RuntimeLayout);
