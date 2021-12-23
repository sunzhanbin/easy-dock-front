import 'antd/dist/antd.css';
//import '@enc/theme-scheme/dist/react/antd/antd.4.17-alpha.6.min.css';
import './styles/base.scss';
//import '@enc/theme-scheme/dist/variable.css';

import { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
// import Auth from '@enc/sso';
import AntdProvider from '@common/components/antd-provider';
import LoginLayout from '@layouts/login-layout';
import SidebarLayout from '@/layouts/sidebar-layout';
import BuilderLayout from '@/layouts/builder-layout';
import RuntimeLayout from '@/layouts/runtime-layout';
import { ROUTES } from '@consts';
import cookie from 'js-cookie';
//import { registerTheme } from '@enc/theme-scheme/dist/utils.esm';

// Auth.setConfig({ server: window.SSO_LOGIN_URL });
const query = decodeURIComponent(window.location.href.split('?')[1]);
const theme = new URLSearchParams(query).get('theme');

/* if (theme) {
  cookie.set('theme', theme);
  registerTheme({
    theme,
  });
} */

function AppEntry() {
  return (
    <AntdProvider>
      <Switch>
        <Route path={ROUTES.LOGIN} component={LoginLayout}></Route>
        <Route path={ROUTES.BUILDER} component={BuilderLayout}></Route>
        <Route path={ROUTES.APP_RUNTIME_DETAIL} component={SidebarLayout}></Route>
        <Route path={ROUTES.INDEX} component={RuntimeLayout}></Route>
      </Switch>
    </AntdProvider>
  );
}

export default memo(AppEntry);
