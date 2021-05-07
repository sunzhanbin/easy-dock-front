import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from '@utils/history';
import App from './main';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root'),
);
