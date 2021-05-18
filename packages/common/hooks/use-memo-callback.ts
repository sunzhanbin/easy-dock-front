import { useEffect, useRef } from 'react';

const callbacks: { [key: string]: (...args: any[]) => any } = {};
const wraps: { [key: string]: (...args: any[]) => any } = {};

export default function useMemoCallback<T extends (...args: any[]) => any>(cb: T, key: string): T {
  const hasUnmountRef = useRef(false);

  // 每次rerender保留最新值
  callbacks[key] = cb;

  useEffect(() => {
    return () => {
      hasUnmountRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (wraps[key]) {
      throw new Error(`${key}已重名，请检查`);
    }

    if (!wraps[key]) {
      wraps[key] = function (...args: any) {
        // 组件卸载后不要再执行了
        if (hasUnmountRef.current) return;

        return callbacks[key](...args);
      };
    }

    return () => {
      delete callbacks[key];
      delete wraps[key];
    };
  }, [key]);

  return wraps[key] as T;
}
