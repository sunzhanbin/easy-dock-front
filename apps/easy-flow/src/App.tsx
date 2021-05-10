import React from 'react';
import logo from './logo.svg';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { ROUTES } from './consts';
import SceneEditor from './features/scene-editor';
import 'antd/dist/antd.css';
import './styles/base.scss';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ROUTES.SCENE_EDITOR} component={SceneEditor}></Route>
        <Route path={ROUTES.INDEX} component={SceneEditor}></Route>
      </Switch>
    </Router>
  );
}

export default App;
