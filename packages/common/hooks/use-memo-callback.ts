import { useEffect, useRef } from 'react';

const callbacks: { [key: string]: (...args: any[]) => any } = {};
const wraps: { [key: string]: (...args: any[]) => any } = {};

export default function useMemoCallback<T extends (...args: any[]) => any>(cb: T): T {
  const hasUnmountRef = useRef(false);
  const keyRef = useRef<string>();

  useEffect(() => {
    keyRef.current = Math.random().toString(36).slice(2);

    return () => {
      hasUnmountRef.current = true;

      if (keyRef.current) {
        delete callbacks[keyRef.current];
      }
    };
  }, []);

  if (keyRef.current) {
    callbacks[keyRef.current] = cb;

    if (!wraps[keyRef.current]) {
      wraps[keyRef.current] = function (...args: any) {
        // 组件卸载后不要再执行了
        if (hasUnmountRef.current) return;

        return callbacks[keyRef.current!](...args);
      };
    }

    return wraps[keyRef.current] as T;
  } else {
    return cb;
  }
}
