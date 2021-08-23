import React, { memo, useMemo, Suspense } from 'react';
import { Route, NavLink, useRouteMatch } from 'react-router-dom';
import { Icon, Loading } from '@common/components';
import { ROUTES } from '@consts';
import styles from './index.module.scss';

const Auth = React.lazy(() => import(/* webpackChunkName: "auth" */ '@/routes/user-manager/auth'));

const UserManager = () => {
  const matched = useRouteMatch();

  const matchedUrl = useMemo(() => {
    return matched.url.replace(/\/+$/, '');
  }, [matched.url]);
  const fallback = useMemo(() => <Loading />, []);
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <div className={styles.menus}>
          <NavLink to={`${matchedUrl}/auth`} className={styles.nav} activeClassName={styles.active}>
            <Icon type="quanxianshezhi" className={styles.icon} />
            <div className={styles.text}>权限设置</div>
          </NavLink>
        </div>
      </div>
      <div className={styles.content}>
        {
          <Suspense fallback={fallback}>
            <Route path={ROUTES.USER_MANAGER_AUTH} component={Auth}></Route>
          </Suspense>
        }
      </div>
    </div>
  );
};

export default memo(UserManager);
