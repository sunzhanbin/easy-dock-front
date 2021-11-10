// import 'antd/dist/antd.css';
// import './styles/base.scss';

import 'theme-scheme/dist/react/antd/antd.4.17-alpha.6.min.css'
import './styles/base.scss';
import 'theme-scheme/dist/variable.css';

import appConfig from './init';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { store } from './app/store';
import AntdProvider from '@common/components/antd-provider';
import App from './App';
import cookie from 'js-cookie';
// @ts-ignore
import {registerTheme} from 'theme-scheme/dist/utils.esm';

const APP_CONTAINER_ID = '#easy-flow-root';

export async function mount(props?: { container: HTMLElement; basename: string; appId: string }) {
  const { container, basename = '/', appId } = props || {};
  const history = createBrowserHistory({ basename });

  const query = decodeURIComponent(window.location.href.split("?")[1])
  const themeFromQuery = (new URLSearchParams(query)).get('theme');
  const themeFromCookie = cookie.get('theme');
  const theme = themeFromQuery || themeFromCookie;

  if(theme) {
    cookie.set('theme', theme);
    registerTheme({
      theme
    })
  }

  if (appId) {
    appConfig.appId = appId;
  }

  ReactDOM.render(
    <AntdProvider>
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    </AntdProvider>,
    container ? container.querySelector(APP_CONTAINER_ID) : document.querySelector(APP_CONTAINER_ID),
  );
}

if (!appConfig.micro) {
  mount();
}

export async function bootstrap() {}

export async function unmount(props: { container: HTMLElement }) {
  const { container } = props;

  ReactDOM.unmountComponentAtNode(
    (container && container.querySelector(APP_CONTAINER_ID)) || document.querySelector(APP_CONTAINER_ID)!,
  );
}
