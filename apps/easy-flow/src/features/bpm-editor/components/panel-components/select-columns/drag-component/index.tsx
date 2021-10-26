import {useEffect, useRef, useState, memo} from "react";
import {useDrag, useDrop} from "react-dnd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "@/features/bpm-editor/components/panel-components/select-columns/index.module.scss";
import {Input, Select, Tooltip} from "antd";
import {Icon} from "@common/components";
import {LabelMap} from '@type'
const {Option} = Select;

interface DraggableOptionProps {
  data: { [key: string]: string };

  columns: any;

  onDelete(index: this['index']): void;

  onChange(type: string, value: string, index: this['index']): void;

  onDrag(sourceIndex: number, targetIndex: number): void;

  index: number;
}

function DraggableOption(props: DraggableOptionProps) {
  const {onDelete, data, onChange, onDrag, index, columns} = props;
  console.log(columns, data, 'rrrr')
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

  return (
    <div className={styles.custom_item} ref={dragWrapperRef}>
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
      <div className={styles.columns}>
        <Select
          className={styles.columns_select}
          suffixIcon={<Icon type="xiala"/>}
          onChange={handleChange}
          {...(data.key ? {defaultValue: data.key} : null)}
        >

          {(columns as LabelMap[])?.map((item) => (
            <Option value={item.key} key={item.key}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Input className={styles.columns_name} size={'middle'} defaultValue={data.title} onChange={handleInputBlur}/>
      </div>
    </div>
  );
}

export default memo(DraggableOption)