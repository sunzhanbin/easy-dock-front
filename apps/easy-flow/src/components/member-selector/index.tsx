import { memo, ReactNode, useMemo, useRef, useState } from 'react';
import { Popover } from 'antd';
import { MemberConfig } from '@type';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import memberDefaultAvatar from '@assets/members/member-default-avatar.png';
import Selector from './selector';
import styles from './index.module.scss';

interface MemberProps {
  data: {
    avatar?: string;
    name: string;
    id: number;
  };
  onDelete?(data: this['data']): void;
  editable?: boolean;
}

const Member = memo(function Member(props: MemberProps) {
  const { data, editable, onDelete } = props;
  const handleDelete = useMemoCallback(() => {
    if (onDelete) {
      onDelete(data);
    }
  });

  return (
    <div className={styles.member}>
      <img className={styles.avatar} src={data.avatar} alt="头像" />
      <div className={styles.name}>{data.name}</div>
      {editable && <Icon className={styles.delete} type="guanbi" onClick={handleDelete} />}
    </div>
  );
});

interface MemberSelectorProps {
  value?: MemberConfig;
  children?: ReactNode;
  readonly?: boolean;
  onChange?(value: MemberConfig): void;
}

const defaultValue: MemberConfig = {
  departs: [],
  members: [],
  includeSubDeparts: true,
};

function MemberSelector(props: MemberSelectorProps) {
  const { value, readonly = false, onChange, children } = props;
  const popoverContentContainerRef = useRef<HTMLDivElement>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [localValue, setLocalValue] = useState<MemberConfig>(value || defaultValue);
  const showValue = value || localValue;
  const getPopupContainer = useMemo(() => {
    return () => popoverContentContainerRef.current!;
  }, []);

  const handleMembersChange = useMemoCallback((newMembers: MemberConfig['members']) => {
    const newValue = {
      ...showValue,
      members: newMembers,
    };

    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  });

  const handleDeleteMember = useMemoCallback((data: MemberProps['data']) => {
    if (onChange) {
      onChange({
        ...showValue,
        members: showValue.members.filter((member) => member.id !== data.id),
      });
    }
  });

  const content = useMemo(() => {
    return <Selector value={showValue} onMembersChange={handleMembersChange} />;
  }, [showValue]);

  return (
    <div className={styles.container}>
      <div className={styles.members}>
        {showValue.departs.map((dept) => (
          <Member editable={!readonly} key={dept.id} data={dept} />
        ))}

        {showValue.members.map((member) => {
          const data = {
            ...member,
            avatar: member.avatar || memberDefaultAvatar,
          };

          return (
            <Member
              editable={!readonly}
              key={member.id}
              data={data}
              onDelete={handleDeleteMember}
            />
          );
        })}

        {!readonly && (
          <Popover
            content={content}
            getPopupContainer={getPopupContainer}
            trigger="click"
            visible={showPopover}
            onVisibleChange={setShowPopover}
            destroyTooltipOnHide
            placement="bottom"
            arrowContent={null}
          >
            <div className={styles.action}>
              {children ? children : <Icon type="xinzengjiacu" className={styles.add} />}
            </div>
          </Popover>
        )}
      </div>
      {!readonly && (
        <div className={styles['popover-content-container']} ref={popoverContentContainerRef} />
      )}
    </div>
  );
}

export default memo(MemberSelector);
