import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import AntdProvider from '@common/components/antd-provider';
import { ROUTES } from './consts';
import BpmEditor from './features/bpm-editor';
import 'antd/dist/antd.css';
import './styles/base.scss';
import './App.css';

function App() {
  return (
    <AntdProvider>
      <Router>
        <Switch>
          <Route path={ROUTES.BPM_EDITOR} component={BpmEditor}></Route>
          <Route path={ROUTES.INDEX} component={BpmEditor}></Route>
        </Switch>
      </Router>
    </AntdProvider>
  );
}

export default App;
