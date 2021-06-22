import { FC, memo, useCallback } from 'react';
import { store } from '@app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { configSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { comAdded } from '../../features/bpm-editor/form-design/formdesign-slice';
import { FieldType, FormField } from '@/type';
import { Icon } from '@common/components';
import styles from './index.module.scss';
import { useDrag } from 'react-dnd';

export interface BoxProps {
  name: string;
}

interface DropResult {
  name: string;
}

const ToolBoxItem: FC<{ icon: string; displayName: string; type: FieldType }> = ({ icon, displayName, type }) => {
  const dispatch = useAppDispatch();
  const configMap = useAppSelector(configSelector);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'toolItem',
    item: { type },
    end: (item, monitor) => {
      // const dropResult = monitor.getDropResult<DropResult>()
      if (item) {
        alert(`You dropped ${item.type}`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const addComponent = useCallback(() => {
    const formDesign = store.getState().formDesign;
    const com = { ...configMap[type], type };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded(com as FormField, rowIndex + 1));
  }, [type, configMap, dispatch]);
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
