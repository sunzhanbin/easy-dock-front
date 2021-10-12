import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import ReportDetail from '@/pages/report-detail';
import { ROUTES } from './router';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={ROUTES.REPORT_DETAIL} component={ReportDetail}/>
      </Switch>
    </div>
  );
}

export default memo(App);
