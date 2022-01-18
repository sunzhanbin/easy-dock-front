import React, { useMemo } from "react";
import classnames from "classnames";
import styles from "./index.module.scss";

export interface StateProps {
  state: "success" | "waiting" | "editing";
  className?: string;
  children: React.ReactNode | string;
}

function State(props: StateProps) {
  const { state, className, children } = props;
  const stateClassName = useMemo(() => {
    if (state === "success") {
      return styles.success;
    } else if (state === "waiting") {
      return styles.waiting;
    } else {
      return styles.editing;
    }
  }, [state]);

  return <div className={classnames(styles.state, stateClassName, className)}>{children}</div>;
}

export default React.memo(State);
