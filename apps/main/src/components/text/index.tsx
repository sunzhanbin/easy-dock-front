import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "antd";
import classnames from "classnames";
import styles from "./index.module.scss";

interface TextProps {
  text: string;
  className?: string;
  maxRows?: number;
  lineHeight: number;
  dotBackground: string;
}

function Text(props: TextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const { text, className, maxRows = 1, lineHeight, dotBackground } = props;
  const [showDot, setShowDot] = useState(false);
  const contentHeight = maxRows * lineHeight;

  useEffect(() => {
    if (!contentRef.current || !shadowRef.current) return;

    const { height: shadowHeight } = shadowRef.current.getBoundingClientRect();

    setShowDot(shadowHeight > contentHeight);
  }, [contentHeight, text]);

  const getPopupContainer = useMemo(() => {
    return () => containerRef.current!;
  }, []);

  const vNode = useMemo(() => {
    return (
      <div
        className={classnames(className, styles.container)}
        ref={containerRef}
        style={{ lineHeight: `${lineHeight}px`, height: contentHeight }}
      >
        <div
          className={classnames(styles.content, { [styles.hasdot]: showDot })}
          style={{ height: contentHeight }}
          ref={contentRef}
        >
          <div className={styles.shadow} ref={shadowRef}>
            {text}
          </div>
          {showDot && (
            <span className={styles.dot} style={{ backgroundColor: dotBackground }}>
              ...
            </span>
          )}
        </div>
      </div>
    );
  }, [text, contentHeight, showDot, className, lineHeight, dotBackground]);

  if (showDot) {
    return (
      <Tooltip title={text} getPopupContainer={getPopupContainer} placement="top">
        {vNode}
      </Tooltip>
    );
  }

  return vNode;
}

export default React.memo(Text);
