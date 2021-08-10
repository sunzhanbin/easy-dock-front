import { memo, ReactNode, useMemo, useRef, useState } from 'react';
import { Popover } from 'antd';
import { ValueType } from './type';
import { Icon } from '@common/components';
import useMemoCallback from '@common/hooks/use-memo-callback';
import memberDefaultAvatar from '@assets/members/member-default-avatar.png';
import { Image } from '@common/components';
import Selector from './selector';
import styles from './index.module.scss';

interface MemberProps {
  data: ValueType['members'][number];
  onDelete?(id: number): void;
  editable?: boolean;
}

const Member = memo(function Member(props: MemberProps) {
  const { data, editable, onDelete } = props;
  const handleDelete = useMemoCallback(() => {
    if (onDelete) {
      onDelete(data.id);
    }
  });

  return (
    <div className={styles.member}>
      <Image className={styles.avatar} src={data.avatar} placeholder={memberDefaultAvatar} size={24} round />
      <div className={styles.name}>{data.name}</div>
      {editable && <Icon className={styles.delete} type="guanbi" onClick={handleDelete} />}
    </div>
  );
});

interface MemberListProps {
  members: ValueType['members'];
  editable?: boolean;
  onDelete?(id: number): void;
  children?: ReactNode;
}

export const MemberList = memo(function MemberList(props: MemberListProps) {
  const { members, editable, onDelete, children } = props;

  return (
    <div className={styles.members}>
      {members.map((member) => {
        return <Member editable={editable} key={member.id} data={member} onDelete={onDelete} />;
      })}
      {children}
    </div>
  );
});

export interface MemberSelectorProps {
  value?: ValueType;
  children?: ReactNode;
  onChange?(value: ValueType): void;
}

const defaultValue: ValueType = {
  members: [],
};

function MemberSelector(props: MemberSelectorProps) {
  const { value, onChange, children } = props;
  const popoverContentContainerRef = useRef<HTMLDivElement>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [localValue, setLocalValue] = useState<ValueType>(value || defaultValue);
  const showValue = value || localValue;
  const getPopupContainer = useMemo(() => {
    return () => popoverContentContainerRef.current!;
  }, []);

  const handleMembersChange = useMemoCallback((newMembers: ValueType['members']) => {
    const newValue = Object.assign({}, showValue, { members: newMembers });

    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  });

  const handleDeleteMember = useMemoCallback((id: number) => {
    if (onChange) {
      onChange({
        ...showValue,
        members: showValue.members.filter((member) => member.id !== id),
      });
    }
  });

  const content = useMemo(() => {
    return <Selector value={showValue} onMembersChange={handleMembersChange} />;
  }, [showValue, handleMembersChange]);

  return (
    <div className={styles.container}>
      <MemberList members={showValue.members} onDelete={handleDeleteMember} editable>
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
      </MemberList>

      <div className={styles['popover-content-container']} ref={popoverContentContainerRef} />
    </div>
  );
}

export default memo(MemberSelector);
