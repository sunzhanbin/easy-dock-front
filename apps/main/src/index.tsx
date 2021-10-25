import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from '@utils/history';
import App from './main';
import { Provider } from 'react-redux';
import { store } from './store';

(async () => {
  await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
})();
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// 解决微前端easyflow里富文本组件使用到setImmediate报错
(window as any).setImmediate = () => {};
