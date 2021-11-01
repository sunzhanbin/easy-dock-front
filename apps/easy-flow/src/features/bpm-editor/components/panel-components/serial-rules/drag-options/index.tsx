import React, {useEffect, useRef, useState, memo} from "react";
import {useDrag, useDrop} from "react-dnd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "../index.module.scss";
import {Tooltip, Input} from "antd";
import {Icon} from "@common/components";
import {RuleOption, SerialNumType, CountResetRules} from "@type";
import IncNumModal from '../components/modal-increase-num';
import DateModal from '../components/modal-date';
import classNames from "classnames";
import {DateOptions} from "@utils/const";

interface DraggableOptionProps {
  data?: RuleOption;
  index: number;
  key: number

  onDelete(index: this['index']): void;

  onChange: (arg0: RuleOption) => void;

  onDrag(sourceIndex: number, targetIndex: number): void;
}

function DraggableOption(props: DraggableOptionProps) {
  const {onDelete, data, onChange, onDrag, index} = props;
  const type = data?.type || 'incNumber'; // 自定义编号规则
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [showIncModal, setShowIncModal] = useState<boolean>(false);
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
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

  const handleInputBlur = useMemoCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onChange({type: 'fixedChars', chars: event.target.value, index});
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

  const handleSubmit = useMemoCallback((values) => {
    type === 'createTime' && setShowDateModal(false)
    type === 'incNumber' && setShowIncModal(false)
    onChange && onChange(values)
  })
  const renderLabel = useMemoCallback(() => {
    switch (data?.type) {
      case 'incNumber':
        const resetDuration = data?.resetDuration as keyof typeof CountResetRules
        const labelStr = `${data?.digitsNum}位数字，${CountResetRules[resetDuration]}`
        return (
          <div className={styles.label} onClick={() => setShowIncModal(true)}>
            <span className={styles.labelStr}>{labelStr}</span>
          </div>
        );
      case 'createTime':
        const date = DateOptions.find(item => item.key === data?.format)?.value
        return (
          <div className={styles.label} onClick={() => setShowDateModal(true)}>
            <span className={styles.labelStr}>格式：{date}</span>
          </div>
        )
      case 'fixedChars':
        return (
          <div className={styles.label}>
            <Input onChange={handleInputBlur} value={data?.chars}/>
          </div>
        )
      case 'fieldName':
        return (
          <div className={styles.label}>
            <span>{data?.fieldValue}</span>
          </div>
        )
    }
  })
  return (
    <div className={styles.draggable} ref={dragWrapperRef}>
      <div className={styles.name}>
        <div className={styles.text}>{SerialNumType[type]}</div>
        {renderLabel()}
      </div>
      <div className={styles.operation}>
        {type !== 'incNumber' && <div className={styles.delete} onClick={handleDelete}>
          <Tooltip title="删除">
            <span>
              <Icon className={styles.iconfont} type="shanchu"/>
            </span>
          </Tooltip>
        </div>}
        <div className={classNames(styles.move, type === 'incNumber' ? styles.incNumber : '')}
             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Tooltip title="拖动换行">
            <span>
              <Icon className={styles.iconfont} type="caidan"/>
            </span>
          </Tooltip>
        </div>
      </div>
      {data?.type &&
      <>
        <IncNumModal
          showIncModal={showIncModal}
          onCancel={() => setShowIncModal(false)}
          onSubmit={handleSubmit}
          data={data}
        />
        <DateModal
          showDateModal={showDateModal}
          onCancel={() => setShowDateModal(false)}
          onSubmit={handleSubmit}
          data={data}
        />

      </>
      }
    </div>
  );
}

export default memo(DraggableOption)