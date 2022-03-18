import React from "react";
import classnames from "classnames";
import "./iconfont";
import "./iconfont-dark";
import styles from "./index.module.scss";

interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;

  onClick?(event: React.MouseEvent): void;
}

export default function Icon(props: IconProps) {
  const { type, className, style, onClick } = props;

  return (
    <svg className={classnames(styles.icon, className)} aria-hidden="true" style={style} onClick={onClick}>
      <use xlinkHref={`#icon-${type}`}></use>
    </svg>
  );
}
