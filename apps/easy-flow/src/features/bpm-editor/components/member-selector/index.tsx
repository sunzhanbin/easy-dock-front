import { memo, useMemo, useEffect, useRef, ReactNode } from 'react';
import { Popover } from 'antd';
import { Icon, MemberList } from '@common/components';
import Selector from '@common/components/member-selector/selectors/member-selector';
import SelectorContext from '@common/components/member-selector/context';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { runtimeAxios } from '@/utils';
import styles from './index.module.scss';
import { useSubAppDetail } from '@/app/app';
import { ValueType } from '@common/components/member-selector/type';
import useShowMembers from '../../flow-design/hooks/use-show-members';
import { setCacheMembers } from '../../flow-design/flow-slice';
import { useAppDispatch } from '@/app/hooks';

interface MemberSelectorProps {
  children?: ReactNode;
  value?: number[];
  onChange?(value: NonNullable<this['value']>): void;
}

const MemberSelector = ({ children, value, onChange }: MemberSelectorProps) => {
  const { data: subAppDetail } = useSubAppDetail();
  const dispatch = useAppDispatch();
  const showValue = useShowMembers({ members: value ?? [], depts: [], roles: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const members = useMemo<ValueType['members']>(() => {
    return showValue.members;
  }, [showValue]);
  const projectId = useMemo(() => {
    return subAppDetail?.app.project.id;
  }, [members]);
  const fetchUser = useMemoCallback(async (data: { name: string; page: number }) => {
    const memberResponse = await runtimeAxios.post('/user/search', {
      index: data.page,
      size: 20,
      keyword: data.name,
      projectId,
    });
    return {
      total: memberResponse.data.recordTotal,
      index: memberResponse.data.pageIndex,
      members: memberResponse.data.data.map(
        (item: { userName: string; id: number; avatar: string; loginName: string }) => {
          return {
            name: item.userName,
            loginName: item.loginName,
            id: item.id,
            avatar: item.avatar,
          };
        },
      ),
    };
  });
  const handleChange = useMemoCallback((val: ValueType['members']) => {
    const members = val.map((v) => v.id as number);
    const caches: Parameters<typeof setCacheMembers>[number] = {};
    val.forEach((v) => {
      caches[v.id] = v;
    });
    dispatch(setCacheMembers(caches));
    onChange && onChange(members);
  });
  const handleDelete = useMemoCallback((val) => {
    const list = (value ? [...value] : []).filter((v) => v !== val);
    onChange && onChange(list);
  });
  const content = useMemo(() => {
    return (
      <SelectorContext.Provider value={{ wrapperClass: styles['member-selector'] }}>
        <Selector fetchUser={fetchUser} value={members} onChange={handleChange} />
      </SelectorContext.Provider>
    );
  }, [value, members]);

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }
    // HACK: 用于更新Popover弹出层的位置
    window.dispatchEvent(new Event('resize'));
  }, [value]);

  return (
    <div ref={containerRef}>
      <MemberList className={styles.members} members={members} editable={true} onDelete={handleDelete}>
        <Popover
          trigger="click"
          placement="bottomRight"
          destroyTooltipOnHide
          arrowContent={null}
          content={content}
          getPopupContainer={(c) => c}
        >
          <div className={styles.action}>
            {children ? children : <Icon type="xinzengjiacu" className={styles.add} />}
          </div>
        </Popover>
      </MemberList>
    </div>
  );
};

export default memo(MemberSelector);
