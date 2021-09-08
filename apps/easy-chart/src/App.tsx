import { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTES } from './consts';
import ChartEditor from './features/chart-editor';

function App() {
  return (
    <Switch>
      <Route path={ROUTES.CHART_EDITOR} component={ChartEditor}></Route>
    </Switch>
  );
}

export default memo(App);

