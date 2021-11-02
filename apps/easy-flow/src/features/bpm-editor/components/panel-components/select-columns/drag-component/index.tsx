import {useEffect, useRef, useState, memo} from "react";
import {useDrag, useDrop} from "react-dnd";
import useMemoCallback from "@common/hooks/use-memo-callback";
import styles from "@/features/bpm-editor/components/panel-components/select-columns/index.module.scss";
import {Input, Select, Tooltip} from "antd";
import {Icon} from "@common/components";
import {LabelMap, OptionItem} from '@type'
const {Option} = Select;

interface DraggableOptionProps {
  data: { [key: string]: string };

  columns: any;
  fieldList: LabelMap[];

  onDelete(index: this['index']): void;

  onChange(type: string, value: any, index: this['index']): void;

  onDrag(sourceIndex: number, targetIndex: number): void;

  index: number;
}

function DraggableOption(props: DraggableOptionProps) {
  const {onDelete, data, onChange, onDrag, index, columns, fieldList} = props;
  const dragWrapperRef = useRef<HTMLDivElement>(null);
  const [canMove, setCanMove] = useState<boolean>(false);

  // const columnsKey = columns.map((item: { key: string; }) => item.key)
  // const filterList = fieldList.filter((item) => !columnsKey.includes(item.key))

  useEffect(() => {
    console.log(data, 'data----------------')
  }, [data])
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
          labelInValue
          onChange={handleChange}
        >
          {/*{(fieldList as LabelMap[])?.map((item) => (*/}
          {/*  <Option key={item.key} value={item.value}>*/}
          {/*    {item.label}*/}
          {/*  </Option>*/}
          {/*))}*/}
          <Option value="jack">Jack (100)</Option>
          <Option value="lucy">Lucy (101)</Option>
        </Select>
        <Input className={styles.columns_name} size={'middle'} defaultValue={data.title} onChange={handleInputBlur}/>
      </div>
    </div>
  );
}

export default memo(DraggableOption)