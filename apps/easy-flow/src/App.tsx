import { memo, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route, useLocation, matchPath } from 'react-router-dom';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import TaskDetail from './features/detail/task-detail';
import StartFlow from './features/detail/start-flow';
import TaskCenter from './features/task-center';
import StartDetail from './features/detail/start-detail';
import appConfig from '@/init';
import { setApp } from '@/features/task-center/taskcenter-slice';

function App({ appId }: { appId?: string }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const id = useMemo(() => {
    if (appConfig.micro && appId) {
      return appId;
    }

    const match = matchPath<{ id: string }>(pathname, { path: ROUTES.TASK_CENTER });

    if (match && match.params) {
      return match.params.id;
    }
  }, [appId, pathname]);

  useEffect(() => {
    if (id) {
      dispatch(setApp({ id }));
    }
  }, [dispatch, id]);

  return (
    <Switch>
      <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
      <Route path={ROUTES.START_FLOW} component={StartFlow}></Route>
      <Route path={ROUTES.START_DETAIL} component={StartDetail}></Route>
      <Route path={ROUTES.TASK_DETAIL} component={TaskDetail}></Route>
      <Route
        // 从主应用传appid时用没有id参数的这种路由
        path={appConfig.micro && appId ? ROUTES.TASK_CENTER_WITH_NO_APPID : ROUTES.TASK_CENTER}
        component={TaskCenter}
      ></Route>
      {/* <Redirect to={ROUTES.INDEX}></Redirect> */}
    </Switch>
  );
}

export default memo(App);
