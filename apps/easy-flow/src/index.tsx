import "antd/dist/antd.css";
import "./styles/base.scss";
// import '@theme/react/antd/antd.4.17-alpha.6.min.css';
import "@theme/src/variable.scss";

import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import AntdProvider from "@common/components/antd-provider";
import cookie from "js-cookie";
import { store } from "./app/store";
import App from "./App";
import appConfig from "./init";
import { registerTheme } from "@theme/src/utils";

const APP_CONTAINER_ID = "#easy-flow-root";

interface AppProps {
  container: HTMLElement;
  basename: string;
  appId: string;
  extra?: any;
}

export async function mount(props?: AppProps) {
  const { container, basename = "/", appId, extra } = props || {};
  const history = createBrowserHistory({ basename });

  const query = decodeURIComponent(window.location.href.split("?")[1]);
  const themeFromQuery = new URLSearchParams(query).get("theme");
  const themeFromCookie = cookie.get("theme");
  const theme = themeFromQuery || themeFromCookie;

  if (theme) {
    cookie.set("theme", theme);
    registerTheme({
      theme,
    });
  }

  if (appId) {
    appConfig.appId = appId;
  }

  if (extra) {
    appConfig.extra = extra;
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

export async function bootstrap() {
  console.log(111);
}

export async function unmount(props: { container: HTMLElement }) {
  const { container } = props;

  ReactDOM.unmountComponentAtNode(
    (container && container.querySelector(APP_CONTAINER_ID)) || document.querySelector(APP_CONTAINER_ID)!,
  );
}
