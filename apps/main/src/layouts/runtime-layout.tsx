import React, { memo, Suspense, useMemo, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loading } from '@common/components';
import Header from '@components/header';
import { useAppSelector } from '@/hooks/use-redux';
import { getUserInfo, userSelector } from '@/store/user';
import { ROUTES } from '@consts';
import { RoleEnum } from '@/schema/app';

const AppsRuntimePage = React.lazy(() => import(/* webpackChunkName: "apps" */ '@/routes/runtime/apps'));

function RuntimeLayout() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useAppSelector(userSelector);
  const fallback = useMemo(() => <Loading />, []);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);
  useEffect(() => {
    if (user.info) {
      const { power } = user.info;
      // 不是正常的租户
      if (power && (power & RoleEnum.TENEMENT) !== RoleEnum.TENEMENT) {
        history.replace(ROUTES.BUILDER);
      }
    }
  }, [user, history]);

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
