import { memo } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import TaskDetail from './features/detail/task-detail';
import StartFlow from './features/detail/start-flow';
import TaskCenter from './features/task-center';
import StartDetail from './features/detail/start-detail';
import ProcessDataManage from './features/process-data-manage';
import appConfig from '@/init';

function App() {
  const { url: basename } = useRouteMatch();
  return (
    <Switch>
      <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
      <Route path={ROUTES.START_FLOW} component={StartFlow}></Route>
      <Route path={ROUTES.START_DETAIL} component={StartDetail}></Route>
      <Route path={ROUTES.TASK_DETAIL} component={TaskDetail}></Route>
      <Route path={ROUTES.PROCESS_DATA_MANAGE} component={ProcessDataManage}></Route>
      <Route
        // 从主应用传appid时用没有id参数的这种路由
        path={appConfig.appId ? ROUTES.TASK_CENTER_WITH_NO_APPID : ROUTES.TASK_CENTER}
        component={TaskCenter}
      ></Route>
    </Switch>
  );
}

export default memo(App);
