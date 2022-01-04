import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { Route, useParams, NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserComponent from '@components/header/user';
import MicroApp from '@components/micro-app';
import { Loading, Icon } from '@common/components';
import { getUserInfo } from '@/store/user';
import { runtimeAxios, getSceneImageUrl } from '@utils';
import { ROUTES, envs } from '@consts';
import { AppSchema, AuthEnum } from '@schema/app';
import styles from './index.module.scss';

function SidebarLayout() {
  const dispatch = useDispatch();
  const matched = useRouteMatch();
  const { appId } = useParams<{ appId: string }>();
  const { pathname,search } = useLocation();
  const [appDetail, setAppDetail] = useState<AppSchema>();
  const [loading, setLoading] = useState(false);
  const [showDataManage, setShowDataManage] = useState<boolean>(false);
  const onlyShowContent = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (search) {
      const params = new URLSearchParams(search.slice(1));
      return params.get('content') || 'false';
    }
    return 'false';
  }, [search]);
  const showHeader = useMemo(() => {
    if(onlyShowContent==='true'){
      return false;
    }
    const path = pathname.replace(ROUTES.APP_PROCESS.replace(':appId', appId), '');
    return path.startsWith('/task-center') || path === '/data-manage';
  }, [pathname, appId,onlyShowContent]);

  useEffect(() => {
    if (!showHeader) return;

    runtimeAxios
      .get<{ data: AppSchema }>(`/app/${appId}`)
      .then(({ data }) => {
        const { power } = data;
        setAppDetail(data);
        setShowDataManage(() => {
          return (power & AuthEnum.DATA) === AuthEnum.DATA;
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, showHeader]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const microExtra = useMemo(() => ({ appId }), [appId]);
  const fallback = useMemo(() => <Loading />, []);
  const matchedUrl = useMemo(() => {
    return matched.url.replace(/\/+$/, '');
  }, [matched.url]);
  const microBasename = useMemo(() => {
    return `/main${ROUTES.APP_PROCESS.replace(':appId', appId)}`;
  }, [appId]);

  return (
    <>
      <div className={styles.layout}>
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
              <NavLink to={`${matchedUrl}/process/task-center`} className={styles.nav} activeClassName={styles.active}>
                <Icon type="renwu" className={styles.icon}></Icon>
                <div className={styles.text}>任务中心</div>
              </NavLink>
              {showDataManage && (
                <NavLink
                  to={`${matchedUrl}/process/data-manage`}
                  className={styles.nav}
                  activeClassName={styles.active}
                >
                  <Icon type="liuchengshujuguanli" className={styles.icon}></Icon>
                  <div className={styles.text}>流程数据管理</div>
                </NavLink>
              )}
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
            {loading && <Loading />}

            {
              <Suspense fallback={fallback}>
                <Route path={ROUTES.APP_PROCESS}>
                  <MicroApp
                    className={styles.micro}
                    entry={envs.EASY_FLOW_FRONTEND_ENTRY}
                    name="easy-flow"
                    basename={microBasename}
                    extra={microExtra}
                  />
                </Route>
              </Suspense>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarLayout);
