import 'antd/dist/antd.css';
// import './styles/base.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import AntdProvider from '@common/components/antd-provider';
import { store } from '@/app/store';
import App from './App';
import appConfig from './init';

const APP_CONTAINER_ID = '#easy-chart-root';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function mount(props?: { container: HTMLElement; basename: string; appId: string }) {
  const { container, basename = '/', appId } = props || {};
  const history = createBrowserHistory({ basename });

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

// todo
// export async function bootstrap() {}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function unmount(props: { container: HTMLElement }) {
  const { container } = props;

  ReactDOM.unmountComponentAtNode(
    (container && container.querySelector(APP_CONTAINER_ID)) || document.querySelector(APP_CONTAINER_ID)!,
  );
}
