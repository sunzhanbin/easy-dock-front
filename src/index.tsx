import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
