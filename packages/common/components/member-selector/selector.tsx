import { memo, useMemo } from 'react';
import { Tabs } from 'antd';
import useMemoCallback from '../../hooks/use-memo-callback';
import { DeptSelector, MemberSelector } from './selectors';
import SelectorContext from './context';
import { axios } from './util';
import { ValueType } from './type';
import styles from './index.module.scss';

const { TabPane } = Tabs;

interface SelectorProps {
  value: ValueType;
  onChange?(value: NonNullable<this['value']>): void;
  projectId?: number;
  className?: string;
  strictDept?: boolean;
}

function Selector(props: SelectorProps) {
  const { value, onChange, projectId, className, strictDept = false } = props;
  const handleMembersChange = useMemoCallback((members: ValueType['members']) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { members }));
  });

  const handleDeptsChange = useMemoCallback((depts: ValueType['depts']) => {
    if (!onChange) return;

    onChange(Object.assign({}, value, { depts }));
  });

  const fetchUser = useMemoCallback(async (data: { name: string; page: number }) => {
    const memberResponse = await axios.post('/user/search', {
      index: data.page,
      size: 20,
      keyword: data.name,
      projectId: projectId,
    });

    return {
      total: memberResponse.data.recordTotal,
      index: memberResponse.data.pageIndex,
      members: memberResponse.data.data.map((item: { userName: string; id: number; avatar: string }) => {
        return {
          name: item.userName,
          id: item.id,
          avatar: item.avatar,
        };
      }),
    };
  });

  const defaultActiveKey = useMemo(() => {
    if (value.members.length) return 'member';
    if (value.depts.length) return 'depart';

    return 'member';
  }, [value]);

  return (
    <SelectorContext.Provider value={{ projectId, wrapperClass: className }}>
      <div className={styles.content}>
        <Tabs defaultActiveKey={defaultActiveKey}>
          <TabPane tab="成员" key="member">
            <MemberSelector value={value.members} onChange={handleMembersChange} fetchUser={fetchUser} />
          </TabPane>
          <TabPane tab="部门" key="depart">
            <DeptSelector value={value.depts} onChange={handleDeptsChange} strict={strictDept} />
          </TabPane>
        </Tabs>
      </div>
    </SelectorContext.Provider>
  );
}

export default memo(Selector);
