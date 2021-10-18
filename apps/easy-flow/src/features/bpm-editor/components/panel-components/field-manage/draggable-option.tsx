import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { Tooltip } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from './index.module.scss';

export interface CompConfig {
  type: string;
  name: string;
  config: any;
}

interface DragProps {
  data: CompConfig;
  index: number;
  onDelete(index: this['index']): void;
  onChange(value: this['data'], index: this['index']): void;
  onDrop(sourceIndex: number, targetIndex: number): void;
}

const DraggableOption = ({ data, index, onChange, onDelete, onDrop }: DragProps) => {
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [, drag] = useDrag(
    () => ({
      type: 'component',
      item() {
        return { index };
      },
      canDrag: () => canMove,
    }),
    [index, canMove],
  );
  const [, drop] = useDrop(
    () => ({
      accept: 'component',
      drop: (currentDragItem: { index: number }) => {
        if (currentDragItem.index !== index) {
          onDrop(currentDragItem.index, index);
        }
      },
    }),
    [onDrop, index],
  );
  const handleDelete = useMemoCallback(() => {
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

  return (
    <div ref={dragWrapperRef} className={styles.draggable}>
      <div className={styles.name}>{data.name}</div>
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
