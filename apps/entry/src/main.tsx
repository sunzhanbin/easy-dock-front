import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "@/reportWebVitals";
import { store } from "@/store";
import App from "@/App";
import "antd/dist/antd.css";
import "@/index.scss";
// main.js

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"),
);

reportWebVitals();
