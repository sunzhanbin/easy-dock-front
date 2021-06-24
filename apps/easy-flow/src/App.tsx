import { memo, useEffect } from 'react';
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

  useEffect(() => {
    if (appConfig.micro && appId) {
      dispatch(setApp({ id: appId }));

      return;
    }

    const match = matchPath<{ id: string }>(pathname, { path: ROUTES.TASK_CENTER });

    if (match && match.params) {
      dispatch(setApp({ id: match.params.id }));
    }
  }, [appId, pathname, dispatch]);

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
