import { memo } from 'react';
import classnames from 'classnames';
import Image from '../image';
import styles from './index.module.scss';

interface AvatarProps {
  name: string;
  size: number;
  src?: string;
  className?: string;
}

function Avatar(props: AvatarProps) {
  const { name, size, src, className } = props;

  return (
    <Image
      className={className}
      size={size}
      src={src}
      placeholder={<span className={classnames(styles.name, className)}>{name.slice(0, 1)}</span>}
    ></Image>
  );
}

export default memo(Avatar);
