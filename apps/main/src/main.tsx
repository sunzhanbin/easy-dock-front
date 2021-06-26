import 'antd/dist/antd.css';
import './styles/base.scss';

import { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import AntdProvider from '@common/components/antd-provider';
import LoginLayout from '@layouts/login-layout';
import SidebarLayout from '@/layouts/sidebar-layout';
import BuilderLayout from '@/layouts/builder-layout';
import RuntimeLayout from '@/layouts/runtime-layout';
import { ROUTES } from '@consts';

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
