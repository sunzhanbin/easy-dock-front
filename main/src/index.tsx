import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from '@utils/history';
import App from './main';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
