import { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import TaskDetail from './features/flow-detail';
import FlowStart from './features/flow-detail/start';
import 'antd/dist/antd.css';
import './styles/base.scss';

function App() {
  return (
    <Switch>
      <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
      <Route path={ROUTES.FLOW_START} component={FlowStart}></Route>
      <Route path={ROUTES.TASK_DETAIL} component={TaskDetail}></Route>
      {/* <Redirect to={ROUTES.INDEX}></Redirect> */}
    </Switch>
  );
}

export default memo(App);
