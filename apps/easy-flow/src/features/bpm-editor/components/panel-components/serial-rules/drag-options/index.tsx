import React, { useEffect, useRef, useState, memo } from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "../index.module.scss";
import { Tooltip, Input, Select } from "antd";
import { Icon } from "@common/components";
import { RuleOption, SerialNumType, CountResetRules } from "@type";
import IncNumModal from "../components/modal-increase-num";
import classNames from "classnames";
import { DateOptions } from "@utils/const";
import { getPopupContainer } from "@utils";

const { Option } = Select;

interface DraggableOptionProps {
  data?: RuleOption;
  index: number;
  key: number;
  fields: { id: string; name: string }[];
  disabled?: boolean;

  onDelete(index: this["index"]): void;

  onChange: (arg0: RuleOption) => void;

  onDrag(sourceIndex: number, targetIndex: number): void;
}

function DraggableOption(props: DraggableOptionProps) {
  const { onDelete, data, onChange, onDrag, index, fields, disabled } = props;
  const type = data?.type || "incNumber"; // 自定义编号规则
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);
  const [showIncModal, setShowIncModal] = useState<boolean>(false);
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: "option",
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
      accept: "option",
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
        onDrag(dragIndex, hoverIndex);
        currentDragItem.index = hoverIndex;
      },
      drop: (currentDragItem: { index: number }) => {
        return { ...currentDragItem, hoverIndex: index };
      },
    }),
    [onDrag, index],
  );

  const handleInputBlur = useMemoCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onChange({ type: "fixedChars", chars: event.target.value, index });
  });

  const handleSelectChange = useMemoCallback((value) => {
    onChange({ type: "createTime", format: value, index });
  });

  const handleChangeField = useMemoCallback((value) => {
    onChange({ type: "fieldName", fieldValue: value, index });
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
    type === "incNumber" && setShowIncModal(false);
    onChange && onChange(values);
  });
  const renderLabel = useMemoCallback(() => {
    switch (data?.type) {
      case "incNumber": {
        const resetDuration = data?.resetDuration as keyof typeof CountResetRules;
        const labelStr = `${data?.digitsNum}位数字，${CountResetRules[resetDuration]}`;
        return (
          <div
            className={classNames(styles.label, disabled ? styles.labelDisable : "")}
            onClick={() => !disabled && setShowIncModal(true)}
          >
            <span className={styles.labelStr}>{labelStr}</span>
          </div>
        );
      }
      case "createTime": {
        const date = DateOptions.find((item) => item.key === data?.format)?.value;
        return (
          <Select
            placeholder="请选择"
            size="large"
            className={styles.formItem}
            value={`格式：${date}`}
            showArrow={true}
            disabled={disabled}
            onChange={handleSelectChange}
            getPopupContainer={getPopupContainer}
          >
            {DateOptions.map(({ key, value }) => (
              <Option key={key} value={key} label={value}>
                {value}
              </Option>
            ))}
          </Select>
        );
      }
      case "fixedChars":
        return (
          <Input
            className={classNames(!data?.chars ? styles.inputBorder : "")}
            size="large"
            onChange={handleInputBlur}
            defaultValue={data?.chars}
            disabled={disabled}
            maxLength={10}
            placeholder="请输入"
          />
        );
      case "fieldName":
        return (
          <div className={styles.label}>
            <Select
              placeholder="请选择"
              size="large"
              className={styles.formItem}
              value={data?.fieldValue}
              showArrow={true}
              disabled={disabled}
              onChange={handleChangeField}
              getPopupContainer={getPopupContainer}
            >
              {fields.map(({ id, name }) => (
                <Option key={id} value={id} label={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
        );
    }
  });
  return (
    <div className={styles.draggable} ref={dragWrapperRef} style={{ opacity }}>
      <div className={styles.name}>
        <div className={styles.text}>{SerialNumType[type]}</div>
        {renderLabel()}
      </div>
      <div className={styles.operation}>
        {type !== "incNumber" && !disabled ? (
          <div className={styles.delete} onClick={handleDelete}>
            <Tooltip title="删除">
              <span>
                <Icon className={styles.iconfont} type="shanchu" />
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className={classNames(styles.delete, styles.disable)}>
            <Tooltip title="自动计数规则不可删除">
              <span>
                <Icon className={styles.iconfont} type="shanchu" />
              </span>
            </Tooltip>
          </div>
        )}
        {!disabled ? (
          <div
            className={classNames(styles.move, type === "incNumber" ? styles.incNumber : "")}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Tooltip title="拖动换行">
              <span>
                <Icon className={styles.iconfont} type="caidan" />
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className={classNames(styles.move, styles.disable)}>
            <span>
              <Icon className={styles.iconfont} type="caidan" />
            </span>
          </div>
        )}
      </div>
      {data?.type && (
        <>
          <IncNumModal
            showIncModal={showIncModal}
            onCancel={() => setShowIncModal(false)}
            onSubmit={handleSubmit}
            data={data}
          />
        </>
      )}
    </div>
  );
}

export default memo(DraggableOption);
