import { urlRegex } from '@/features/bpm-editor/form-design/validate';
import { UrlOptionItem } from '@/type';
import { memo, FC, useState, useEffect } from 'react';

const Iframe: FC<{ url: UrlOptionItem; maxHeight?: number }> = ({ url, maxHeight }) => {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    if (url.type === 'custom') {
      if (url.customValue && urlRegex.test(url.customValue)) {
        setSrc(url.customValue);
      }
    } else if (url.type === 'interface') {
    }
  }, [url]);
  return <div></div>;
};

export default memo(Iframe);
