import { Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import './styles/base.scss';
import LoginLayout from '@layouts/login-layout';
import PrimaryLayout from '@layouts/main-layout';

export default function AppEntry() {
  return (
    <Switch>
      <Route path="/login" component={LoginLayout}></Route>
      <Route path="/" component={PrimaryLayout}></Route>
    </Switch>
  );
}
