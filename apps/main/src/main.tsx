import 'antd/dist/antd.css';
import './styles/base.scss';

import { memo, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AntdProvider from '@common/components/antd-provider';
import LoginLayout from '@layouts/login-layout';
import SidebarLayout from '@/layouts/sidebar-layout';
import PrimaryLayout from '@layouts/main-layout';
import { shouldHideHeaderUrls, ROUTES } from '@consts';
import { toggleHeader } from '@/store/layout';

function AppEntry() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // 提取当前路径命中了shouldHideHeaderUrls中哪个需要隐藏头部的url
    const matchedHideHeadUrl = shouldHideHeaderUrls.find((url) => new RegExp(url.replace(/\//g, '\\/')).test(pathname));

    // 如果命中了需要隐藏头部的url就隐藏头部
    dispatch(toggleHeader(!matchedHideHeadUrl));
  }, [pathname, dispatch]);

  return (
    <AntdProvider>
      <Switch>
        <Route path={ROUTES.LOGIN} component={LoginLayout}></Route>
        <Route path={ROUTES.APP_PANEL} component={SidebarLayout}></Route>
        <Route path={ROUTES.INDEX} component={PrimaryLayout}></Route>
      </Switch>
    </AntdProvider>
  );
}

export default memo(AppEntry);
