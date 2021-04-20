import { useMemo } from 'react';

interface IconProps {
  type: string;
  className?: string;
  onClick?(): void;
}
export default function Icon(props: IconProps) {
  const { type, className, onClick } = props;
  const classnames = useMemo(() => {
    return `iconfont icon${type} ${className || ''}`.trim();
  }, [type, className]);

  return <i className={classnames} onClick={onClick}></i>;
}
