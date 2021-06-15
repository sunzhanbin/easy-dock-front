import './index.css';
import appConfig from './init';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { store } from './app/store';
import AntdProvider from '@common/components/antd-provider';
import App from './App';

const APP_CONTAINER_ID = '#easy-flow-root';

export async function mount(props?: { container: HTMLElement; basename: string }) {
  const { container, basename = '/' } = props || {};
  const history = createBrowserHistory({ basename });

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
