import { memo, ReactNode, useMemo, useRef, useState, useEffect } from 'react';
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
  projectId?: number;
  searchListClassName?: string;
}

const defaultValue: ValueType = {
  members: [],
};

function MemberSelector(props: MemberSelectorProps) {
  const { value, onChange, children, projectId, searchListClassName } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [localValue, setLocalValue] = useState<ValueType>(value || defaultValue);
  const popoverContentContainerRef = useRef<HTMLDivElement>(null);
  const selectorContainerRef = useRef<HTMLDivElement>(null);
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
    return (
      <div ref={selectorContainerRef}>
        <Selector
          className={searchListClassName}
          value={showValue}
          onMembersChange={handleMembersChange}
          projectId={projectId}
        />
      </div>
    );
  }, [showValue, handleMembersChange, projectId, searchListClassName]);

  useEffect(() => {
    // HACK: 用于更新Popover弹出层的位置
    if (selectorContainerRef.current) {
      const padding = selectorContainerRef.current.style.paddingBottom;

      if (padding) {
        selectorContainerRef.current.style.paddingBottom = '';
      } else {
        selectorContainerRef.current.style.paddingBottom = '1px';
      }
    }
  }, [value?.members.length]);

  return (
    <div className={styles.container} ref={popoverContentContainerRef}>
      <MemberList members={showValue.members} onDelete={handleDeleteMember} editable>
        <Popover
          content={content}
          getPopupContainer={getPopupContainer}
          trigger="click"
          visible={showPopover}
          onVisibleChange={setShowPopover}
          destroyTooltipOnHide
          placement="bottomRight"
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
