import { memo, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'antd/dist/antd.css';
import './styles/base.scss';

import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import LoginLayout from '@layouts/login-layout';
import PrimaryLayout from '@layouts/main-layout';
import { shouldHideHeaderUrls } from '@consts';
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
    <ConfigProvider locale={zh_CN}>
      <Switch>
        <Route path="/login" component={LoginLayout}></Route>
        <Route path="/" component={PrimaryLayout}></Route>
      </Switch>
    </ConfigProvider>
  );
}

export default memo(AppEntry);
