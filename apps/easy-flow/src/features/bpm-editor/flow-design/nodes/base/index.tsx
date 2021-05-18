import { memo, ReactNode } from 'react';

interface BaseProps {
  onClick(): void;
  children: ReactNode;
  name: string;
  icon: string;
}

function Base(props: BaseProps) {
  const { onClick, children } = props;

  return <div onClick={onClick}>{children}</div>;
}

export default memo(Base);
