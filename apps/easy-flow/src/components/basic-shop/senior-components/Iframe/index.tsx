import { loadSrc } from '@/apis/detail';
import { useContainerContext } from '@/components/form-engine/context';
import { urlRegex } from '@/features/bpm-editor/form-design/validate';
import { UrlOptionItem } from '@/type';
import { memo, FC, useState, useEffect, useMemo } from 'react';
import styles from './index.module.scss';

const Iframe: FC<{ url: UrlOptionItem; height?: number }> = ({ url, height }) => {
  const context = useContainerContext();
  const [src, setSrc] = useState<string>('');
  const style = useMemo(() => {
    let iframeHeight = '';
    if (!src) {
      iframeHeight = '40px';
    } else if (!height) {
      iframeHeight = 'auto';
    } else {
      iframeHeight = `${height}px`;
    }

    return { height: iframeHeight };
  }, [height, src]);
  useEffect(() => {
    (async () => {
      const formDataList: { name: string; value: any }[] = [];
      if (context && context.form) {
        const { form } = context;
        const formData = form.getFieldsValue();
        Object.entries(formData).forEach(([key, value]: [string, any]) => {
          formDataList.push({ name: key, value });
        });
      }
      const src: string = await loadSrc(url, formDataList);
      if (urlRegex.test(src)) {
        setSrc(src);
      }
    })();
  }, [url, context]);
  return (
    <div className={styles.container} style={style}>
      {src ? (
        <iframe src={src} className={styles.iframe} frameBorder={0}></iframe>
      ) : (
        <div className={styles.tip}>请设置iframe的url</div>
      )}
    </div>
  );
};

export default memo(Iframe);
