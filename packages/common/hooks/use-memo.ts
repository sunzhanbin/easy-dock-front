import { useEffect, useRef } from 'react';

const callbacks: { [key: string]: Function } = {};
const wraps: { [key: string]: Function } = {};

export default function useMemoCallback<T extends (...args: any[]) => any>(cb: T, key: string): T {
  const hasDidmountRef = useRef(false);
  const hasUnmountRef = useRef(false);

  if (!hasDidmountRef.current && wraps[key]) {
    throw new Error(`${key}已重名，请检查`);
  }

  // 每次rerender保留最新值
  callbacks[key] = cb;

  if (!wraps[key]) {
    wraps[key] = function (...args: any) {
      // 组件卸载后不要再执行了
      if (hasUnmountRef.current) return;

      return callbacks[key](...args);
    };
  }

  useEffect(() => {
    return () => {
      hasUnmountRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!hasDidmountRef.current) {
      hasDidmountRef.current = true;
    }

    return () => {
      delete callbacks[key];
      delete wraps[key];
    };
  }, [key]);

  return wraps[key] as T;
}
