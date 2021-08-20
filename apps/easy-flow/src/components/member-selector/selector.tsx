import { memo } from 'react';
import { Tabs } from 'antd';
import { ValueType } from './type';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { DepartSelector, MemberSelector } from './selectors';
import SelectorContext from './context';
import styles from './index.module.scss';

const { TabPane } = Tabs;

interface SelectorProps {
  value: ValueType;
  onChange?(value: NonNullable<this['value']>): void;
  projectId?: number;
  className?: string;
  strictDepart?: boolean;
}

function Selector(props: SelectorProps) {
  const { value, onChange, projectId, className, strictDepart = false } = props;
  const handleMembersChange = useMemoCallback((members: ValueType['members']) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { members }));
  });

  const handleDepartsChange = useMemoCallback((departs: ValueType['departs']) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { departs }));
  });

  return (
    <SelectorContext.Provider value={{ projectId, wrapperClass: className }}>
      <div className={styles.content}>
        <Tabs defaultActiveKey="depart">
          <TabPane tab="成员" key="member">
            <MemberSelector value={value.members} onChange={handleMembersChange} />
          </TabPane>
          <TabPane tab="部门" key="depart">
            <DepartSelector value={value.departs} onChange={handleDepartsChange} strict={strictDepart} />
          </TabPane>
        </Tabs>
      </div>
    </SelectorContext.Provider>
  );
}

export default memo(Selector);
