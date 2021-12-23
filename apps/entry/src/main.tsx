import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "@/reportWebVitals";
import { store } from "@/store";
import App from "@/App";
import "antd/dist/antd.css";
import "@/index.scss";
// main.js
import microApp from "@micro-zoe/micro-app";

microApp.start();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
