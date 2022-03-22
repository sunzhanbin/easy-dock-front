import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import classnames from "classnames";
import cookie from "js-cookie";
import "./iconfont-light";
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

  const location = useLocation();

  const theme = useMemo<string>(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    return cookie.get("theme") || "light";
  }, [location.search]);
  return (
    <svg className={classnames(styles.icon, className)} aria-hidden="true" style={style} onClick={onClick}>
      <use xlinkHref={theme === "dark" ? `#icon-${type}` : `#custom-icon-${type}`}></use>
    </svg>
  );
}
