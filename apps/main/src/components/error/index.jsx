import React from "react";
import { Button } from "antd";
import styles from "./index.module.scss";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== "development") {
      console.log(error, errorInfo);
    }
  }

  handleRefresh() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>程序出错了</h1>
            <div className={styles.tip}>
              请
              <Button className={styles.btn} type="link" onClick={this.handleRefresh}>
                刷新
              </Button>
              页面尝试
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
