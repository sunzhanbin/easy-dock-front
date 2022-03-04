import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Tooltip, TooltipProps } from "antd";
import classnames from "classnames";
import { getContainer as commonGetContainer } from "../../utils";
import styles from "./index.module.scss";

interface TextProps {
  className?: string;
  text?: string;
  placement?: TooltipProps["placement"];
  children?: React.ReactNode;
  zIndex?: number;
  delay?: number;
  getContainer?: TooltipProps["getTooltipContainer"] | false;
}

function Text(props: TextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { className, getContainer, text, placement = "top", children, zIndex = 3000, delay = 300 } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const showTooltipTimerRef = useRef<NodeJS.Timeout>();
  const getTooltipContainer: TooltipProps["getTooltipContainer"] = useMemo(() => {
    // 插入body
    if (getContainer === false) return undefined;

    // 不传时插入父级
    return getContainer || commonGetContainer;
  }, [getContainer]);

  useEffect(() => {
    return () => {
      if (showTooltipTimerRef.current) {
        clearTimeout(showTooltipTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (showTooltipTimerRef.current !== undefined) {
      clearTimeout(showTooltipTimerRef.current);
    }

    showTooltipTimerRef.current = setTimeout(() => {
      if (containerRef.current) {
        const range = document.createRange();
        const node = containerRef.current;

        range.setStart(node, 0);
        range.setEnd(node, node.childNodes.length);

        const rangeWidth = range.getBoundingClientRect().width;

        if (Math.floor(rangeWidth) > node.offsetWidth && Number(getComputedStyle(node).opacity) === 1) {
          setShowTooltip(Math.floor(rangeWidth) > node.offsetWidth);
        }
      }
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const wraperNode = useMemo(() => {
    return (
      <div
        ref={containerRef}
        className={classnames(styles.container, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children || text}
      </div>
    );
  }, [children, text, handleMouseEnter, handleMouseLeave, className]);

  if (showTooltip) {
    return (
      <Tooltip
        title={children || text}
        visible
        zIndex={zIndex}
        placement={placement}
        getTooltipContainer={getTooltipContainer}
        destroyTooltipOnHide
        overlayClassName={styles.tooltip}
      >
        {wraperNode}
      </Tooltip>
    );
  }

  return <>{wraperNode}</>;
}

export default React.memo(Text);
