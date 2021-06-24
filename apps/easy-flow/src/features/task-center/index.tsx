import { memo, useCallback, FC, useState, useEffect, useMemo } from 'react';
import { NavLink, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { Input, Button, Drawer } from 'antd';
import { Icon } from '@common/components';
import styles from './index.module.scss';
import Todo from './todo';
import Start from './start';
import Done from './done';
import Card from './card';
import { useAppSelector } from '@/app/hooks';
import { todoNumSelector } from './taskcenter-reducer';
import useApp from '@/hooks/use-app';
import { SubAppItem } from './type';
import { axios } from '@/utils';

// import Copy from './copy';

const TaskCenter: FC<{}> = () => {
  const match = useRouteMatch();
  const matchedPath = match.path.replace(/\/$/, '');
  const matchedUrl = match.url.replace(/\/$/, '');
  const todoNum = useAppSelector(todoNumSelector);
  const app = useApp();
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

  useEffect(() => {
    if (isShowDrawer && app) {
      axios.get(`/subapp/${app.id}/list/all/deployed`).then((res) => {
        const list = res.data || [];
        setSubAppList(list);
      });
    }
  }, [app, isShowDrawer]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>任务中心</div>
          <div className={styles.line}></div>
          <div className={styles.navLink}>
            <NavLink to={`${matchedUrl}`} exact className={styles.nav} activeClassName={styles.active}>
              我的待办
              {location.pathname === `${matchedUrl}/todo` && todoNum > 0 && (
                <div className={styles.todoNum}>{todoNum}</div>
              )}
            </NavLink>
            <NavLink to={`${matchedUrl}/start`} className={styles.nav} activeClassName={styles.active}>
              我的发起
            </NavLink>
            <NavLink to={`${matchedUrl}/done`} className={styles.nav} activeClassName={styles.active}>
              我的已办
            </NavLink>
            {/* 这个版本暂时不做 */}
            {/* <NavLink to={`${matchedUrl}/copy`} className={styles.nav} activeClassName={styles.active}>
              抄送我的
            </NavLink> */}
          </div>
        </div>
        <div className={styles.right}>
          <Button type="primary" size="large" className={styles.startFlow} onClick={handleStart}>
            发起流程
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Route path={`${matchedPath}/start`} component={Start}></Route>
          <Route path={`${matchedPath}/done`} component={Done}></Route>
          <Route path="*" component={Todo}></Route>
          {/* <Route path={`${matchedPath}/copy`} component={Copy}></Route> */}
          {/* <Redirect to={`${matchedPath}/todo`}></Redirect> */}
        </Switch>
      </div>
      <div className={styles.footer}>
        <Drawer
          placement="bottom"
          visible={isShowDrawer}
          closable={false}
          maskClosable={false}
          height={437}
          className={styles.drawer}
          bodyStyle={{ background: 'rgba(24, 31, 67, 0.75)', overflow: 'hidden' }}
        >
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
        </Drawer>
      </div>
    </div>
  );
};

export default memo(TaskCenter);
