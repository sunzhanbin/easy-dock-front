import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import history from "@utils/history";
import { Provider } from "react-redux";
import App from "./main";

import { store } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root"),
);
// 解决微前端easyflow里富文本组件使用到setImmediate报错
(window as any).setImmediate = function () {
  return;
};
