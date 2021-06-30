import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';

export default function useConfirmLeave(shouldBlock: boolean, onConfirm: (onCancel: () => void) => void) {
  const history = useHistory();
  const isUnmountedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;

      if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const unBlock = history.block((location, action) => {
      if (isUnmountedRef.current) return;

      if (shouldBlock) {
        if (timerRef.current !== undefined) clearTimeout(timerRef.current);

        // TODO 用定时器是为了解决该应用做为微前端嵌入主应用时从子应用跳到主应用会触发block但是拦不住跳转,
        // 这样会出现在主应用里有个未保存离开页面的弹窗, 现在无法精确判断return false时当前页面是否还显示
        timerRef.current = setTimeout(() => {
          if (isUnmountedRef.current) return;

          onConfirm(() => {
            unBlock();

            setTimeout(() => {
              if (action === 'POP') {
                history.goBack();
              } else if (action === 'PUSH') {
                history.push(location.pathname + location.search);
              } else if (action === 'REPLACE') {
                history.replace(location.pathname + location.search);
              }
            }, 100);
          });
        }, 100);
        return false;
      }
    });

    return () => {
      unBlock();
    };
  }, [history, shouldBlock]);
}
