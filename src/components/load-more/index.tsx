import React, { useEffect, useRef } from 'react';
import Loading from '@components/loading';
import classnames from 'classnames';
import styles from './index.module.scss';

interface LoadMoreProps {
  loading?: boolean;
  loadmore(): void;
  done: boolean;
  children: React.ReactNode;
  className: string;
  debounce?: number;
  threshold?: number;
}

export default function LoadMore(props: LoadMoreProps) {
  const { children, done, loadmore, className, debounce = 300, threshold = 300, loading } = props;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    let timer: NodeJS.Timeout;

    function scroll() {
      clearTimeout(timer);

      timer = setTimeout(() => {
        const container = scrollContainerRef.current!;

        if (container.scrollHeight - container.offsetHeight - container.scrollTop < threshold) {
          loadmore();
        }
      }, debounce);
    }

    function clear() {
      clearTimeout(timer);
      scrollContainerRef.current?.removeEventListener('scroll', scroll);
    }

    if (done) {
      return clear();
    }

    scrollContainerRef.current.addEventListener('scroll', scroll, false);

    return clear;
  }, [done, loadmore, debounce, threshold]);

  return (
    <div className={classnames(styles.container)}>
      <div ref={scrollContainerRef} className={classnames(styles.list, className)}>
        {children}
      </div>
      {loading && <Loading className={styles.loading} />}
    </div>
  );
}
