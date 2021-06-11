import { memo } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import FlowDetail from './features/flow-detail';
import FlowStart from './features/flow-detail/start';
import 'antd/dist/antd.css';
import './styles/base.scss';

function App() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
      <Route path={ROUTES.FLOW_START} component={FlowStart}></Route>
      <Route path={ROUTES.FLOW_DETAIL} component={FlowDetail}></Route>
      <Redirect to={`/bpm-editor/123`}></Redirect>
    </Switch>
  );
}

export default memo(App);
