import { Switch, Route } from 'react-router-dom';
import 'antd/dist/antd.css';
import './styles/base.scss';

import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import LoginLayout from '@layouts/login-layout';
import PrimaryLayout from '@layouts/main-layout';

export default function AppEntry() {
  return (
    <ConfigProvider locale={zh_CN}>
      <Switch>
        <Route path="/login" component={LoginLayout}></Route>
        <Route path="/" component={PrimaryLayout}></Route>
      </Switch>
    </ConfigProvider>
  );
}
