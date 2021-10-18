import { memo, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import componentSchema from '@/config/components';
import styles from './index.module.scss';

interface ComProps {
  value?: any;
  onChange?: (value: this['value']) => void;
}

const componentList = Object.values(componentSchema)
  .map((com) => com.baseInfo)
  .filter((com) => com.type !== 'Tabs');

const FieldManage = (props: ComProps) => {
  const handleAddComponent = useMemoCallback((type: string) => {
    console.info(type, 'add');
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

  return (
    <div className={styles.fields}>
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
