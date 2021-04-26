import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from '@utils/history';
import App from './main';

// import { registerMicroApps, start } from 'qiankun';
// registerMicroApps([
//   {
//     name: 'orch',
//     entry: '//localhost:3000/',
//     container: '#sub-app-container',
//     activeRule: '/orch',
//     props: {
//       basename: '/orch',
//     },
//   },
// ]);

// start();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root'),
);
