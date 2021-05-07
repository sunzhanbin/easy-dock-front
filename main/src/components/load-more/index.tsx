import React, { useEffect, useMemo, useRef } from 'react';
import throttle from 'lodash/throttle';
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

    const handleScroll = throttle(() => {
      const container = scrollContainerRef.current!;

      if (container.scrollHeight - container.offsetHeight - container.scrollTop < threshold) {
        loadmore();
      }
    }, debounce);

    function clear() {
      handleScroll.cancel();

      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    }

    if (done) {
      return clear();
    }

    scrollContainerRef.current.addEventListener('scroll', handleScroll, false);

    return clear;
  }, [done, loadmore, debounce, threshold]);

  const hasChildren = useMemo(() => {
    if (!children) {
      return false;
    }

    if (Array.isArray(children)) {
      return children.length > 0;
    }

    return true;
  }, [children]);

  return (
    <div className={classnames(styles.container, { [styles['not-empty']]: hasChildren })}>
      <div ref={scrollContainerRef} className={classnames(styles.list, className)}>
        {children}
      </div>
      {loading && <Loading className={styles.loading} />}
    </div>
  );
}
