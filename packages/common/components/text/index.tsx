import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import styles from './index.module.scss';

function Text(props: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { className, getContainer, text, placement = 'top', children, zIndex = 3000 } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  const getPopupContainer = useMemo(() => {
    if (getContainer === false) return undefined;

    return getContainer || (() => containerRef.current);
  }, [getContainer]);

  const handleMouseEnter = useCallback(() => {
    const range = document.createRange();
    const node = containerRef.current!;

    range.setStart(node, 0);
    range.setEnd(node, node.childNodes.length);

    const rangeWidth = range.getBoundingClientRect().width;

    setShowTooltip(Math.floor(rangeWidth) > node.offsetWidth);
  }, []);

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
        title={text}
        visible
        zIndex={zIndex}
        placement={placement}
        getPopupContainer={getPopupContainer}
        destroyTooltipOnHide
      >
        {wraperNode}
      </Tooltip>
    );
  }

  return <>{wraperNode}</>;
}

export default React.memo(Text);
