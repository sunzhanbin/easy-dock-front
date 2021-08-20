import { memo } from 'react';
import classnames from 'classnames';
import Image from '../image';
import { Icon } from '..';
import memberDefaultAvatar from './member-default-avatar.png';
import useMemoCallback from '../../hooks/use-memo-callback';
import { User } from '../../type';
import styles from './index.module.scss';

type MemberProps = {
  data: User;
  editable?: boolean;
  className?: string;
  onDelete?(id: number): void;
};

const Member = (props: MemberProps) => {
  const { data, editable, className, onDelete } = props;
  const handleDelete = useMemoCallback(() => {
    if (onDelete) {
      onDelete(data.id);
    }
  });
  return (
    <div className={classnames(styles.member, className ? className : '')}>
      <Image className={styles.avatar} src={data.avatar} placeholder={memberDefaultAvatar} size={24} round />
      <div className={styles.name}>{data.username}</div>
      {editable && <Icon className={styles.delete} type="guanbi" onClick={handleDelete} />}
    </div>
  );
};

export default memo(Member);
