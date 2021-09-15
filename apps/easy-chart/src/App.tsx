import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTES } from './router';
// import './App.css';
import ReportDetail from './pages/report-detail';

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
