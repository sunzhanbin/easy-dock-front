import { memo, useCallback, FC, useState, useEffect, useMemo } from 'react';
import { NavLink, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { Input, Button } from 'antd';
import classNames from 'classnames';
import { Icon } from '@common/components';
import { useAppSelector } from '@/app/hooks';
import useAppId from '@/hooks/use-app-id';
import { useAppDispatch } from '@app/hooks';
import { runtimeAxios } from '@/utils';
import styles from './index.module.scss';
import Todo from './todo';
import Start from './start';
import Done from './done';
import Card from './card';
import Draft from './draft';
import Copy from './copy';
import { todoNumSelector } from './taskcenter-reducer';
import { loadApp } from './taskcenter-slice';
import { SubAppItem } from './type';

const TaskCenter: FC = () => {
  const dispatch = useAppDispatch();
  const match = useRouteMatch();
  const matchedPath = match.path.replace(/\/$/, '');
  const matchedUrl = match.url.replace(/\/$/, '');
  const todoNum = useAppSelector(todoNumSelector);
  const appId = useAppId();
  const location = useLocation();
  const [isShowDrawer, setIsShowDrawer] = useState<boolean>(false);
  const [subAppList, setSubAppList] = useState<SubAppItem[]>([]);
  const [keyword, setKeyWord] = useState<string>('');
  const handleStart = useCallback(() => {
    setIsShowDrawer(true);
  }, []);
  const filterSubAppList = useMemo(() => {
    return subAppList.filter(({ name }) => name.indexOf(keyword) > -1);
  }, [subAppList, keyword]);

  const theme = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get('theme') || 'light';
    }
    return 'light';
  }, [location.search]);

  const mode = useMemo(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get('mode') || 'running';
    }
    return 'running';
  }, [location.search]);
  const onlyShowContent = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get('content') || 'false';
    }
    return 'false';
  }, [location.search]);

  useEffect(() => {
    if (isShowDrawer && appId) {
      runtimeAxios.get(`/subapp/${appId}/list/all`).then((res) => {
        const list = (res.data || []).filter((v: { type: number }) => v.type === 2);
        setSubAppList(list);
      });
    }
  }, [appId, isShowDrawer]);
  useEffect(() => {
    appId && dispatch(loadApp(appId));
  }, [appId, dispatch]);
  return (
    <div className={classNames(styles.container, styles[theme])}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>任务中心</div>
          <div className={styles.line}></div>
          <div className={styles.navLink}>
            <NavLink
              to={`${matchedUrl}?theme=${theme}&mode=${mode}&content=${onlyShowContent}`}
              replace
              exact
              className={styles.nav}
              activeClassName={styles.active}
            >
              我的待办
              {location.pathname === `${matchedUrl}` && todoNum > 0 && <div className={styles.todoNum}>{todoNum}</div>}
            </NavLink>
            <NavLink
              to={`${matchedUrl}/start?theme=${theme}&mode=${mode}&content=${onlyShowContent}`}
              replace
              className={styles.nav}
              activeClassName={styles.active}
            >
              我的发起
            </NavLink>
            <NavLink
              to={`${matchedUrl}/done?theme=${theme}&mode=${mode}&content=${onlyShowContent}`}
              replace
              className={styles.nav}
              activeClassName={styles.active}
            >
              我的已办
            </NavLink>
            <NavLink
              to={`${matchedUrl}/copy?theme=${theme}&mode=${mode}&content=${onlyShowContent}`}
              className={styles.nav}
              activeClassName={styles.active}
            >
              抄送我的
            </NavLink>
            <NavLink
              to={`${matchedUrl}/draft?theme=${theme}&mode=${mode}&content=${onlyShowContent}`}
              replace
              className={styles.nav}
              activeClassName={styles.active}
            >
              草稿
            </NavLink>
          </div>
        </div>
        <div className={styles.right}>
          {mode === 'running' && (
            <Button type="primary" size="large" className={styles.startFlow} onClick={handleStart}>
              发起流程
            </Button>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Route path={`${matchedPath}/start`} component={Start}></Route>
          <Route path={`${matchedPath}/done`} component={Done}></Route>
          <Route path={`${matchedPath}/draft`} component={Draft}></Route>
          <Route path={`${matchedPath}/copy`} component={Copy}></Route>
          <Route path={matchedPath} component={Todo}></Route>
          {/* <Redirect to={`${matchedPath}/todo`}></Redirect> */}
        </Switch>
      </div>
      <div className={styles.footer}>
        {isShowDrawer && (
          <>
            <div
              className={styles.mask}
              style={{
                width: `${document.body.clientWidth}px`,
                height: `${document.body.clientHeight}px`,
              }}
            ></div>
            <div className={styles.model}>
              <div className={styles.header}>
                <div className={styles.left}>
                  <div className={styles.title}>发起流程</div>
                  <Input
                    size="small"
                    placeholder="搜索子应用名称"
                    bordered={false}
                    className={styles.search}
                    onChange={(e) => {
                      setKeyWord(e.target.value);
                    }}
                    prefix={<Icon type="sousuo" className={styles.icon} />}
                  />
                </div>
                <div
                  className={styles.right}
                  onClick={() => {
                    setIsShowDrawer(false);
                  }}
                >
                  <Icon type="guanbi" className={styles.close} />
                </div>
              </div>
              <div className={styles.content}>
                {filterSubAppList.map(({ id, name }) => (
                  <Card id={id} name={name} key={id} className={styles.card} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(TaskCenter);
