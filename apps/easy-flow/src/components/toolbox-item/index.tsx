import { FC, memo, useCallback } from 'react';
import { store } from '@app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { configSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { comAdded } from '../../features/bpm-editor/form-design/formdesign-slice';
import { FieldType, FormField } from '@/type';
import { Icon } from '@common/components';
import styles from './index.module.scss';

const ToolBoxItem: FC<{ icon: string; displayName: string; type: FieldType }> = ({ icon, displayName, type }) => {
  const dispatch = useAppDispatch();
  const configMap = useAppSelector(configSelector);
  const addComponent = useCallback(() => {
    const formDesign = store.getState().formDesign;
    const com = { ...configMap[type], type };
    const rowIndex = formDesign?.layout?.length || -1;
    dispatch(comAdded(com as FormField, rowIndex + 1));
  }, [type, configMap, dispatch]);
  return (
    <div className={styles.container} onClick={addComponent}>
      <div className={styles.icon_container}>
        <Icon type={icon} className={styles.iconfont} />
      </div>
      <span className={styles.component_name}>{displayName}</span>
    </div>
  );
};

export default memo(ToolBoxItem);
