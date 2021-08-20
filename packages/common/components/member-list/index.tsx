import { memo, ReactNode } from 'react';
import Member from '../member';
import { User } from '../../type';
import styles from './index.module.scss';

type MemberListProps = {
  members: User[];
  editable?: boolean;
  onDelete?(id: number): void;
  children?: ReactNode;
};

const MemberList = (props: MemberListProps) => {
  const { members, editable, onDelete, children } = props;
  return (
    <div className={styles.members}>
      {members.map((member) => {
        return (
          <Member editable={editable} key={member.id} data={member} className={styles.member} onDelete={onDelete} />
        );
      })}
      {children}
    </div>
  );
};

export default memo(MemberList);
