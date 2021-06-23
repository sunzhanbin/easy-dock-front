import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import UserComponent from '@components/header/user';
import { Loading, Icon } from '@common/components';
import MicroApp from '@components/micro-app';
import { getUserInfo } from '@/store/user';
import { runtimeAxios, getSceneImageUrl } from '@utils';
import { envs } from '@consts';
import { RootState } from '@/store';
import { AppSchema } from '@schema/app';
import styles from './sidebar-layout.module.scss';

function SidebarLayout() {
  const dispatch = useDispatch();
  const { url: currentUrl } = useRouteMatch();

  const { showHeader } = useSelector((state: RootState) => state.layout);
  const { appId } = useParams<{ appId: string }>();
  const [appDetail, setAppDetail] = useState<AppSchema>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runtimeAxios.get<{ data: AppSchema }>(`/app/${appId}`).then(({ data }) => {
      setAppDetail(data);
    });
  }, [appId]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  return (
    <>
      <div className={styles.layout}>
        {loading && <Loading />}

        {showHeader && (
          <div className={styles.sidebar}>
            {appDetail && (
              <>
                <img className={styles.img} src={getSceneImageUrl(appDetail.icon)} alt="" />
                <div className={styles.title}>{appDetail.name}</div>
              </>
            )}

            <div className={styles.menus}>
              <div className={styles.menu}>
                <Icon type="renwu" className={styles.icon}></Icon>
                <div className={styles.text}>任务中心</div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.main}>
          {showHeader && (
            <div className={styles.header}>
              <UserComponent></UserComponent>
            </div>
          )}

          <MicroApp
            entry={envs.EASY_FLOW_FRONTEND_ENTRY}
            name="easy-flow"
            className={classnames(styles.content, { [styles['with-header']]: showHeader })}
            basename={currentUrl}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(SidebarLayout);
