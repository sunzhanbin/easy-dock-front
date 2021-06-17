import { ReactNode, memo, useState, useEffect } from 'react';
import styles from './index.module.scss';

interface ImageProps {
  placeholder?: string | ReactNode;
  src: string;
}

function Image(props: ImageProps) {
  const { placeholder, src } = props;
  const [imgUrl, setImgUrl] = useState(placeholder);

  useEffect(() => {}, []);

  return <div></div>;
}

export default memo(Image);
