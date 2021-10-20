import { memo, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import { uniqueId } from 'lodash';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import componentSchema from '@/config/components';
import DraggableOption from './draggable-option';
import styles from './index.module.scss';
import { CompConfig, FormField } from '@/type';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { configSelector } from '@/features/bpm-editor/form-design/formzone-reducer';
import { setSubComponentConfig } from '@/features/bpm-editor/form-design/formdesign-slice';
interface ComProps {
  parentId: string;
  value?: CompConfig[];
  onChange?: (value: this['value']) => void;
}

const componentList = Object.values(componentSchema)
  .map((com) => com.baseInfo)
  .filter((com) => com.type !== 'Tabs');

const FieldManage = ({ parentId, value, onChange }: ComProps) => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(configSelector);
  const handleAddComponent = useMemoCallback((type: FormField['type']) => {
    const com = componentList.find((com) => com.type === type);
    const list = value ? [...value] : [];
    const id = uniqueId(`${type}_`);
    list.push({ type, name: com!.name, config: { ...config[type], id, fieldName: id, parentId } });
    onChange && onChange(list);
  });
  const overlay = useMemo(() => {
    return (
      <Menu>
        {componentList.map(({ type, name }) => (
          <Menu.Item
            key={type}
            className={styles.item}
            onClick={() => {
              handleAddComponent(type as FormField['type']);
            }}
          >
            {name}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [handleAddComponent]);

  const handleDrop = useMemoCallback((sourceIndex: number, targetIndex: number) => {
    const list = value ? [...value] : [];
    const tmp = list[sourceIndex];
    list[sourceIndex] = list[targetIndex];
    list[targetIndex] = tmp;
    onChange && onChange(list);
  });
  const handleDelete = useMemoCallback((index: number) => {
    const list = value ? [...value] : [];
    list.splice(index, 1);
    onChange && onChange(list);
  });
  const handleEdit = useMemoCallback((value) => {
    dispatch(setSubComponentConfig({ config: value.config }));
  });

  return (
    <div className={styles.fields}>
      {value?.map((v, i) => {
        return (
          <DraggableOption key={i} index={i} data={v} onEdit={handleEdit} onDelete={handleDelete} onDrop={handleDrop} />
        );
      })}
      <Dropdown placement="bottomLeft" trigger={['click']} overlay={overlay} getPopupContainer={(c) => c}>
        <div className={styles.add_custom}>
          <Icon className={styles.iconfont} type="xinzengjiacu" />
          <span>添加字段</span>
        </div>
      </Dropdown>
    </div>
  );
};
export default memo(FieldManage);
