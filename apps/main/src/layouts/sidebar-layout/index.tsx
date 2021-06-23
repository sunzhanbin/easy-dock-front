import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { Route, useParams, NavLink, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserComponent from '@components/header/user';
import { Loading, Icon } from '@common/components';
import { getUserInfo } from '@/store/user';
import { runtimeAxios, getSceneImageUrl } from '@utils';
import { ROUTES } from '@consts';
import { RootState } from '@/store';
import { AppSchema } from '@schema/app';
import styles from './index.module.scss';

const TaskCenter = React.lazy(() => import(/* webpackChunkName: "task-center" */ '@/routes/runtime/task-center'));

function SidebarLayout() {
  const dispatch = useDispatch();
  const matched = useRouteMatch();
  const { showHeader } = useSelector((state: RootState) => state.layout);
  const { appId } = useParams<{ appId: string }>();
  const [appDetail, setAppDetail] = useState<AppSchema>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runtimeAxios
      .get<{ data: AppSchema }>(`/app/${appId}`)
      .then(({ data }) => {
        setAppDetail(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const fallback = useMemo(() => <Loading />, []);
  const matchedUrl = useMemo(() => {
    return matched.url.replace(/\/+$/, '');
  }, [matched.path]);

  return (
    <>
      <div className={styles.layout}>
        {loading && <Loading />}

        {showHeader && (
          <div className={styles.sidebar}>
            <div className={styles.info}>
              {appDetail && (
                <>
                  <img className={styles.img} src={getSceneImageUrl(appDetail.icon)} alt="" />
                  <div className={styles.title}>{appDetail.name}</div>
                </>
              )}
            </div>

            <div className={styles.menus}>
              <NavLink to={`${matchedUrl}/task-center`} className={styles.nav} activeClassName={styles.active}>
                <Icon type="renwu" className={styles.icon}></Icon>
                <div className={styles.text}>任务中心</div>
              </NavLink>
            </div>
          </div>
        )}
        <div className={styles.main}>
          {showHeader && (
            <div className={styles.header}>
              <UserComponent></UserComponent>
            </div>
          )}

          <div className={styles.content}>
            {
              <Suspense fallback={fallback}>
                <Route path={ROUTES.APP_TASK_CENTER} component={TaskCenter}></Route>
              </Suspense>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarLayout);
