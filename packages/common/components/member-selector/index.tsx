import { memo, ReactNode, useMemo, useRef, useState, useEffect } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import { Icon, Image } from '../../components';
import useMemoCallback from '../../hooks/use-memo-callback';
import memberDefaultAvatar from './avatars/member-default-avatar.png';
import departDefaultAvatar from './avatars/depart-default-avatar.png';
import { ValueType, Key } from './type';
import Selector from './selector';
import styles from './index.module.scss';

export type MemberType = 'dept' | 'member' | 'role';
interface MemberProps {
  data: { name: string; avatar?: string; id: Key };
  onDelete?(id: this['data']['id']): void;
  editable?: boolean;
  children?: ReactNode;
}

const Member = memo(function Member(props: MemberProps) {
  const { data, editable, onDelete, children } = props;
  const handleDelete = useMemoCallback(() => {
    if (onDelete) {
      onDelete(data.id);
    }
  });

  return (
    <div className={styles.member}>
      {children}
      <div className={styles.name}>{data.name}</div>
      {editable && <Icon className={styles.delete} type="guanbi" onClick={handleDelete} />}
    </div>
  );
});

interface MemberListProps {
  members?: ValueType['members'];
  depts?: ValueType['depts'];
  roles?: ValueType['roles'];
  editable?: boolean;
  onDelete?(id: Key, tpye: MemberType): void;
  children?: ReactNode;
  className?: string;
}

export const MemberList = memo(function MemberList(props: MemberListProps) {
  const { members = [], depts = [], roles = [], editable, onDelete, children, className } = props;

  return (
    <div className={classNames(styles.members, className)}>
      {depts.map((depart) => (
        <Member
          editable={editable}
          key={depart.id}
          data={depart}
          onDelete={(departId) => onDelete && onDelete(departId, 'dept')}
        >
          <Image className={styles.avatar} src={depart.avatar} placeholder={departDefaultAvatar} size={24} round />
        </Member>
      ))}

      {roles.map((role) => (
        <Member
          editable={editable}
          key={role.id}
          data={role}
          onDelete={(roleId) => onDelete && onDelete(roleId, 'role')}
        />
      ))}

      {members.map((member) => {
        return (
          <Member
            editable={editable}
            key={member.id}
            data={member}
            onDelete={(memberId) => onDelete && onDelete(memberId, 'member')}
          >
            <Image className={styles.avatar} src={member.avatar} placeholder={memberDefaultAvatar} size={24} round />
          </Member>
        );
      })}

      {children}
    </div>
  );
});

export interface MemberSelectorProps {
  value?: ValueType;
  children?: ReactNode;
  onChange?(value: ValueType): void;
  projectId?: number;
  selectorWrapperClass?: string;
  strictDept?: boolean;
  onDelete?(id: string | number, type: MemberType): void;
  listClass?: string;
}

const defaultValue: ValueType = {
  members: [],
  depts: [],
  roles: [],
};

function MemberSelector(props: MemberSelectorProps) {
  const { value, onChange, children, projectId, strictDept, selectorWrapperClass, onDelete, listClass } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [localValue, setLocalValue] = useState<ValueType>(value || defaultValue);
  const popoverContentContainerRef = useRef<HTMLDivElement>(null);
  const selectorContainerRef = useRef<HTMLDivElement>(null);
  const showValue = value || localValue;
  const getPopupContainer = useMemo(() => {
    return () => popoverContentContainerRef.current!;
  }, []);

  const handleChange = useMemoCallback((newValue: ValueType) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  });

  const handleDeleteMember = useMemoCallback((id: Key, type: MemberType) => {
    if (onDelete) {
      onDelete(id, type);
    }

    if (!onChange) return;

    let key: keyof ValueType;

    if (type === 'dept') {
      key = 'depts';
    } else if (type === 'member') {
      key = 'members';
    } else if (type === 'role') {
      key = 'roles';
    } else {
      return null as never;
    }

    onChange({
      ...showValue,
      [key]: showValue[key].filter((item) => item.id !== id),
    });
  });

  const content = useMemo(() => {
    return (
      <div ref={selectorContainerRef}>
        <Selector
          className={selectorWrapperClass}
          value={showValue}
          onChange={handleChange}
          projectId={projectId}
          strictDept={strictDept}
        />
      </div>
    );
  }, [showValue, handleChange, projectId, selectorWrapperClass, strictDept]);

  useEffect(() => {
    return () => {
      if (!popoverContentContainerRef || !popoverContentContainerRef.current) return;

      // HACK: 用于更新Popover弹出层的位置
      window.dispatchEvent(new Event('resize'));
    };
  }, [value?.members.length, value?.depts.length]);

  return (
    <div className={styles.container} ref={popoverContentContainerRef}>
      <MemberList
        members={showValue.members}
        onDelete={handleDeleteMember}
        depts={showValue.depts}
        roles={showValue.roles}
        className={listClass}
        editable
      >
        <Popover
          content={content}
          getPopupContainer={getPopupContainer}
          trigger="click"
          visible={showPopover}
          onVisibleChange={setShowPopover}
          destroyTooltipOnHide
          placement="bottomLeft"
          arrowContent={null}
        >
          <div className={styles.action}>
            {children ? children : <Icon type="xinzengjiacu" className={styles.add} />}
          </div>
        </Popover>
      </MemberList>
    </div>
  );
}

export default memo(MemberSelector);
