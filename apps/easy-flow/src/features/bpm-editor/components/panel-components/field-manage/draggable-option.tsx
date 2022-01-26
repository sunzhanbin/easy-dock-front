import { CompConfig } from "@/type";
import { Icon } from "@common/components";
import useMemoCallback from "@common/hooks/use-memo-callback";
import { Tooltip } from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import classNames from "classnames";
import styles from "./index.module.scss";

interface DragProps {
  className?: string;
  data: CompConfig;
  index: number;
  onDelete(index: this["index"]): void;
  onEdit(value: this["data"], index: this["index"]): void;
  onDrop(sourceIndex: number, targetIndex: number): void;
}

const DraggableOption = ({ className, data, index, onEdit, onDelete, onDrop }: DragProps) => {
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "component",
      item() {
        return { index };
      },
      canDrag: () => canMove,
      collect(monitor) {
        return { opacity: monitor.isDragging() ? 0.2 : 1 };
      },
    }),
    [index, canMove],
  );
  const [, drop] = useDrop(
    () => ({
      accept: "component",
      hover: (currentDragItem: { index: number }, monitor: DropTargetMonitor) => {
        if (!dragWrapperRef.current) {
          return;
        }
        const dragIndex = currentDragItem.index;
        const hoverIndex = index;
        if (hoverIndex === dragIndex) {
          return;
        }
        const hoverBoundingRect = dragWrapperRef.current?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
        // Dragging downwards
        if (dragIndex === -1 || (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)) {
          return;
        }

        // Dragging upwards
        if (dragIndex === -1 || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
          return;
        }
        onDrop(dragIndex, hoverIndex);
        currentDragItem.index = hoverIndex;
      },
      drop: (currentDragItem: { index: number }) => {
        return { ...currentDragItem, hoverIndex: index };
      },
    }),
    [onDrop, index],
  );
  const handleDelete = useMemoCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(index);
  });

  useEffect(() => {
    drag(drop(dragWrapperRef));
  }, [drag, drop]);

  const handleMouseEnter = useMemoCallback(() => {
    setCanMove(true);
  });
  const handleMouseLeave = useMemoCallback(() => {
    setCanMove(false);
  });
  const handleClick = useMemoCallback(() => {
    onEdit(data, index);
  });

  return (
    <div
      ref={dragWrapperRef}
      style={{ opacity }}
      className={classNames(styles.draggable, className ? className : "")}
      onClick={handleClick}
    >
      <div className={styles.name}>
        <Icon type={data.config.icon} className={styles.icon} />
        <div className={styles.text}>{data.config.label}</div>
      </div>
      <div className={styles.operation}>
        <div className={styles.delete} onClick={handleDelete}>
          <Tooltip title="删除">
            <span>
              <Icon className={styles.iconfont} type="shanchu" />
            </span>
          </Tooltip>
        </div>
        <div className={styles.move} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Tooltip title="拖动换行">
            <span>
              <Icon className={styles.iconfont} type="caidan" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default memo(DraggableOption);
