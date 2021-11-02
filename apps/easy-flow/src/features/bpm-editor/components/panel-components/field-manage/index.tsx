import { memo, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import { uniqueId } from 'lodash';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import componentSchema from '@/config/components';
import DraggableOption from './draggable-option';
import styles from './index.module.scss';
import { CompConfig, ConfigItem, FormField, SchemaItem } from '@/type';
import { useAppDispatch } from '@/app/hooks';
import { setSubComponentConfig } from '@/features/bpm-editor/form-design/formdesign-slice';
interface ComProps {
  parentId: string;
  value?: CompConfig[];
  onChange?: (value: this['value']) => void;
}

const componentList = Object.values(componentSchema).filter((com) => com.baseInfo.type !== 'Tabs');

const FieldManage = ({ parentId, value, onChange }: ComProps) => {
  const dispatch = useAppDispatch();
  const handleAddComponent = useMemoCallback((type: FormField['type']) => {
    const list = value ? [...value] : [];
    const id = uniqueId(`${parentId}·${type}_`);
    const { baseInfo, config: schema } = componentList.find((v) => v.baseInfo.type === type) as SchemaItem;
    const config: ConfigItem = {
      id,
      parentId,
      type,
      icon: baseInfo?.icon,
      canSubmit: type === 'DescText' ? false : true,
      multiple: type === 'Checkbox',
    };
    const props: ConfigItem = { type, id };
    schema.forEach((item) => {
      item.isProps ? (props[item.key] = item.defaultValue) : (config[item.key] = item.defaultValue);
    });
    config.fieldName = id;
    list.push({ config, props });
    onChange && onChange(list);
  });
  const overlay = useMemo(() => {
    return (
      <Menu>
        {componentList.map(({ baseInfo }) => (
          <Menu.Item
            key={baseInfo.type}
            className={styles.item}
            onClick={() => {
              handleAddComponent(baseInfo.type as FormField['type']);
            }}
          >
            {baseInfo.name}
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
    dispatch(setSubComponentConfig({ config: { ...value.config, ...value.props } }));
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
