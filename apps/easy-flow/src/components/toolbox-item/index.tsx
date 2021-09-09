import { FC, memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { configSelector, formDesignSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { comAdded, comInserted } from '../../features/bpm-editor/form-design/formdesign-slice';
import { FieldType, FormField } from '@/type';
import { Icon } from '@common/components';
import styles from './index.module.scss';
import { useDrag } from 'react-dnd';

interface DropResult {
  rowIndex: number;
  hoverIndex: number;
  id: string;
}

const ToolBoxItem: FC<{ icon: string; displayName: string; type: FieldType }> = ({ icon, displayName, type }) => {
  const dispatch = useAppDispatch();
  const configMap = useAppSelector(configSelector);
  const formDesign = useAppSelector(formDesignSelector);
  const [, drag] = useDrag(
    () => ({
      type: 'toolItem',
      item: { rowIndex: -1, id: type },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        console.log(`dropResult`, dropResult);
        const com = { ...configMap[type], type };
        dropResult && dispatch(comInserted(com as FormField, dropResult?.hoverIndex));
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [type],
  );
  const addComponent = useCallback(() => {
    const com = { ...configMap[type], type };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded(com as FormField, rowIndex + 1));
  }, [type, configMap, formDesign, dispatch]);
  return (
    <div
      className={styles.container}
      onClick={addComponent}
      ref={drag}
      role="toolItem"
      data-testid={`toolItem-${type}`}
    >
      <div className={styles.icon_container}>
        <Icon type={icon} className={styles.iconfont} />
      </div>
      <span className={styles.component_name}>{displayName}</span>
    </div>
  );
};

export default memo(ToolBoxItem);
