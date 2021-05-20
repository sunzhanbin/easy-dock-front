import React from 'react';
// import logo from './logo.svg';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import 'antd/dist/antd.css';
import './styles/base.scss';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
        <Route path={ROUTES.INDEX} component={BpmEditor}></Route>
      </Switch>
    </Router>
  );
}

export default App;
