import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PubSub from 'pubsub-js';
import { FormInstance } from 'antd';
import { FormValue } from '@type/detail';
import { analysisFormChangeRule } from '@/utils';
import { ContainerProvider } from './context';
import { formRulesItem } from './utils';

interface ContainerProps {
  rules: formRulesItem[];
  children?: React.ReactNode;
  fieldName: string;
  form: FormInstance<FormValue>;
  type: string;
}

const Container = React.memo(({ children, rules, fieldName, form, type }: ContainerProps) => {
  const visibleRules = useMemo(() => rules?.filter((item) => item?.subtype == 0), [rules]);
  const [visible, setVisible] = useState<boolean>(true);
  const [reFreshKey, setReFreshKey] = useState<Number>(0);
  const currentCondition = useMemo(() => visibleRules && visibleRules[visibleRules.length - 1], [visibleRules]);

  const setComponentValueAndVisible = useCallback(() => {
    const isMatchArr = rules?.filter((item) => {
      const { condition } = item;
      const formValues = form.getFieldsValue();
      return analysisFormChangeRule(condition, formValues);
    });
    if(isMatchArr?.length) {
      const current = isMatchArr[isMatchArr.length - 1];
      const { visible } = current;
      setVisible(visible as boolean)
    } else {
      setVisible(true);
    }
  }, [currentCondition]);

  const watchFn = useCallback((rules: formRulesItem[]) => {
    return [
      ...new Set(
        rules.reduce((a, b) => {
          const { type, watch } = b;
          const watchType = watch.map((item) => `${item}-${type}`);
          return a.concat(watchType);
        }, [] as any),
      ),
    ];
  }, []);

  useEffect(() => {
    if (!rules) return;

    const watchs = watchFn(rules);

    const visibleWatchs = watchFn(visibleRules);

    // @Todo: watchs 需要再次过滤，因为 value 可能不是依赖项，需要从当前表单里筛选；
    watchs?.map((item: any) => {
      console.log('sub::', item);
      PubSub.subscribe(item, (msg: string) => {
        if (visibleWatchs.includes(msg)) {
          setComponentValueAndVisible();
        } else {
          setReFreshKey(Date.now());
        }
      });
    });

    return () => {
      watchs?.map((item: any) => {
        PubSub.unsubscribe(item);
      });
    };
  }, []);

  return (
    <ContainerProvider value={{ rules, form, fieldName, type }}>
      {visible ? React.cloneElement(children as React.ReactElement<any>, { refresh: reFreshKey }) : null}
    </ContainerProvider>
  );
});
export default Container;
