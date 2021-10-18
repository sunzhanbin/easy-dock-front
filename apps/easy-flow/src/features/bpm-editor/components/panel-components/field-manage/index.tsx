import { memo, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import componentSchema from '@/config/components';
import DraggableOption, { CompConfig } from './draggable-option';
import styles from './index.module.scss';
interface ComProps {
  value?: CompConfig[];
  onChange?: (value: this['value']) => void;
}

const componentList = Object.values(componentSchema)
  .map((com) => com.baseInfo)
  .filter((com) => com.type !== 'Tabs');

const FieldManage = ({ value, onChange }: ComProps) => {
  const handleAddComponent = useMemoCallback((type: string) => {
    const com = componentList.find((com) => com.type === type);
    const list = value ? [...value] : [];
    list.push({ type, name: com!.name, config: {} });
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
              handleAddComponent(type);
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

  return (
    <div className={styles.fields}>
      {value?.map((v, i) => {
        return (
          <DraggableOption key={i} index={i} data={v} onChange={() => {}} onDelete={handleDelete} onDrop={handleDrop} />
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
