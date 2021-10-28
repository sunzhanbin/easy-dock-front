import React, {useEffect, useRef, useState, memo} from "react";
import {useDrag, useDrop} from "react-dnd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "../index.module.scss";
import {Input, Tooltip} from "antd";
import {Icon} from "@common/components";
import {RuleOption, SerialNumType} from "@type";

interface DraggableOptionProps {
  // todo
  data?: RuleOption;

  onDelete(index: this['index']): void;

  onChange(type: string, value: string, index: this['index']): void;

  onDrag(sourceIndex: number, targetIndex: number): void;

  index: number;

  key: number
}

function DraggableOption(props: DraggableOptionProps) {
  const {onDelete, data, onChange, onDrag, index} = props;
  console.log(data?.type || 'incNumber', '333')
  const type = data?.type || 'incNumber'
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [, drag] = useDrag(
    () => ({
      type: 'option',
      item() {
        return {index};
      },
      canDrag: () => canMove,
    }),
    [index, canMove],
  );
  const [, drop] = useDrop(
    () => ({
      accept: 'option',
      drop: (currentDragItem: { index: number }) => {
        if (currentDragItem.index !== index) {
          onDrag(currentDragItem.index, index);
        }
      },
    }),
    [onDrag, index],
  );

  const handleChange = useMemoCallback((value) => {
    onChange('select', value, index);
  });

  const handleInputBlur = useMemoCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onChange('blur', event.target.value, index);
  });

  const handleDelete = useMemoCallback(() => {
    onDelete(index);
  });

  const handleMouseEnter = useMemoCallback(() => {
    setCanMove(true);
  });

  const handleMouseLeave = useMemoCallback(() => {
    setCanMove(false);
  });

  useEffect(() => {
    drag(drop(dragWrapperRef));
  }, [drag, drop]);

  const renderLabel = useMemoCallback(() => {
    return (
      <>333</>
    )
  })
  return (
    <div className={styles.draggable} ref={dragWrapperRef}>
      <div className={styles.name}>
        <div className={styles.text}>{SerialNumType[type]}</div>
        <div className={styles.label}>
          {renderLabel()}
        </div>
      </div>
      <div className={styles.operation}>
        <div className={styles.delete} onClick={handleDelete}>
          <Tooltip title="删除">
            <span>
              <Icon className={styles.iconfont} type="shanchu"/>
            </span>
          </Tooltip>
        </div>
        <div className={styles.move} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Tooltip title="拖动换行">
            <span>
              <Icon className={styles.iconfont} type="caidan"/>
            </span>
          </Tooltip>
        </div>
      </div>
      <div className={styles.columns}>
        {/*<Input className={styles.columns_name} size={'middle'} defaultValue={data.title} onChange={handleInputBlur}/>*/}
      </div>
    </div>
  );
}

export default memo(DraggableOption)