import { memo, useMemo } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import useMemoCallback from '../../hooks/use-memo-callback';
import { DeptSelector, MemberSelector, RoleSelector } from './selectors';
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
  const debounceChange = useMemoCallback(
    debounce((value: ValueType) => {
      if (!onChange) return;

      onChange(value);
    }, 100),
  );

  const handleMembersChange = useMemoCallback((members: ValueType['members']) => {
    debounceChange(Object.assign({}, value, { members }));
  });

  const handleDeptsChange = useMemoCallback((depts: ValueType['depts']) => {
    debounceChange(Object.assign({}, value, { depts }));
  });

  const handleRolesChange = useMemoCallback((roles: ValueType['roles']) => {
    debounceChange(Object.assign({}, value, { roles }));
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
    if (value.roles.length) return 'role';

    return 'member';
  }, [value]);

  return (
    <SelectorContext.Provider value={{ projectId, wrapperClass: className }}>
      <div className={styles.main}>
        <Tabs defaultActiveKey={defaultActiveKey}>
          <TabPane tab="成员" key="member">
            <MemberSelector value={value.members} onChange={handleMembersChange} fetchUser={fetchUser} />
          </TabPane>
          <TabPane tab="部门" key="depart">
            <DeptSelector value={value.depts} onChange={handleDeptsChange} strict={strictDept} />
          </TabPane>
          <TabPane tab="角色" key="role">
            <RoleSelector value={value.roles} onChange={handleRolesChange} />
          </TabPane>
        </Tabs>
      </div>
    </SelectorContext.Provider>
  );
}

export default memo(Selector);
