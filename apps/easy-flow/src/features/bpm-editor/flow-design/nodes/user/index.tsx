import { memo } from 'react';
import { UserNode as UserNodeType } from '../../types';

interface UserNodeProps {
  node: UserNodeType;
}

function UserNode(props: UserNodeProps) {
  const { node } = props;

  return <div>usernode</div>;
}

export default memo(UserNode);
