import { memo, ReactNode, useMemo, useRef, useState, useEffect } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import { Icon, Image } from '../../components';
import useMemoCallback from '../../hooks/use-memo-callback';
import memberDefaultAvatar from './avatars/member-default-avatar.png';
import departDefaultAvatar from './avatars/depart-default-avatar.png';
import { ValueType } from './type';
import Selector from './selector';
import styles from './index.module.scss';

export type MemberType = 'depart' | 'member';
interface MemberProps {
  data: { name: string; avatar?: string; id: number | string };
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
  members: ValueType['members'];
  departs?: ValueType['departs'];
  editable?: boolean;
  onDelete?(id: number | string, tpye: MemberType): void;
  children?: ReactNode;
  className?: string;
}

export const MemberList = memo(function MemberList(props: MemberListProps) {
  const { members, editable, onDelete, children, departs = [], className } = props;

  return (
    <div className={classNames(styles.members, className)}>
      {departs.map((depart) => (
        <Member
          editable={editable}
          key={depart.id}
          data={depart}
          onDelete={(departId) => onDelete && onDelete(departId, 'depart')}
        >
          <Image className={styles.avatar} src={depart.avatar} placeholder={departDefaultAvatar} size={24} round />
        </Member>
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
  strictDepart?: boolean;
}

const defaultValue: ValueType = {
  members: [],
  departs: [],
};

function MemberSelector(props: MemberSelectorProps) {
  const { value, onChange, children, projectId, strictDepart, selectorWrapperClass } = props;
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

  const handleDeleteMember = useMemoCallback((id: number, type: MemberType) => {
    if (!onChange) return;

    let key: keyof ValueType;

    if (type === 'depart') {
      key = 'departs';
    } else if (type === 'member') {
      key = 'members';
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
          strictDepart={strictDepart}
        />
      </div>
    );
  }, [showValue, handleChange, projectId, selectorWrapperClass, strictDepart]);

  useEffect(() => {
    return () => {
      if (!popoverContentContainerRef) return;

      // HACK: 用于更新Popover弹出层的位置
      window.dispatchEvent(new Event('resize'));
    };
  }, [value?.members.length, value?.departs.length]);

  return (
    <div className={styles.container} ref={popoverContentContainerRef}>
      <MemberList members={showValue.members} onDelete={handleDeleteMember} departs={value?.departs} editable>
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
