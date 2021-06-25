import React, { Suspense, useEffect, useMemo, useCallback } from 'react';
import { Route, NavLink, useLocation, NavLinkProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '@components/header';
import Loading from '@components/loading';
import { getUserInfo } from '@/store/user';
import { ROUTES, micros, shouldHideHeaderUrls } from '@consts';
import styles from './index.module.scss';

const AppListPage = React.lazy(() => import(/* webpackChunkName: "scenes-list" */ '@/routes/scenes/main'));

const AppPage = React.lazy(() => import(/* webpackChunkName: "app-detail" */ '@/routes/app-detail'));
const IntegrationPage = React.lazy(() => import(/* webpackChunkName: "integration" */ '@/routes/integration'));

const MicroPage = React.lazy(() => import(/* webpackChunkName: "micro" */ '@/routes/micro-page'));

export default function PrimaryLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const showHeader = useMemo(() => {
    return !shouldHideHeaderUrls.find((url) => new RegExp(url.replace(/\//g, '\\/')).test(pathname));
  }, [pathname]);

  const fallback = useMemo(() => <Loading />, []);

  // 注册微应用的路由
  const microsUrls = useMemo(() => {
    return micros.map((micro) => micro.route);
  }, []);

  const indexNavIsActive: NavLinkProps['isActive'] = useCallback((match, location) => {
    if (match || /^\/scenes-detail\/\d+/.test(location.pathname)) {
      return true;
    } else {
      return false;
    }
  }, []);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  return (
    <>
      {showHeader && (
        <Header>
          <div className={styles.navs}>
            <NavLink
              to={ROUTES.BUILDER}
              isActive={indexNavIsActive}
              className={styles.nav}
              activeClassName={styles.active}
            >
              应用管理
            </NavLink>
            <NavLink to={ROUTES.TMPLATE_CENTER} className={styles.nav} activeClassName={styles.active}>
              模版中心
            </NavLink>
            <NavLink to={ROUTES.SYSTEM_MANAGE} className={styles.nav} activeClassName={styles.active}>
              系统管理
            </NavLink>
          </div>
        </Header>
      )}

      <Suspense fallback={fallback}>
        <Route path={[ROUTES.BUILDER, ROUTES.BUILDER_INDEX]} exact component={AppListPage}></Route>
        <Route path={ROUTES.BUILDER_APP} component={AppPage}></Route>
        <Route path={ROUTES.INTEGRATION} component={IntegrationPage}></Route>
        <Route path={microsUrls}>
          <MicroPage hasHeader={showHeader}></MicroPage>
        </Route>
      </Suspense>
    </>
  );
}
