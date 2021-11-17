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
  changeType?: string;
}

export const Container = React.memo(({ children, rules, fieldName, form, type }: ContainerProps) => {
  const visibleRules = useMemo(() => rules?.filter((item) => item?.subtype === 0), [rules]);
  const [visible, setVisible] = useState<boolean>(true);
  const [reFreshKey, setReFreshKey] = useState<number>(0);

  const setComponentValueAndVisible = useCallback(() => {
    const isMatchArr = rules?.filter((item) => {
      const { condition } = item;
      const formValues = form.getFieldsValue();
      if (!Array.isArray(condition)) return null;
      return analysisFormChangeRule(condition, formValues);
    });
    if (isMatchArr?.length) {
      const current = isMatchArr[isMatchArr.length - 1];
      const { visible } = current;
      setVisible(visible as boolean);
    } else {
      setVisible(true);
    }
  }, [form, rules]);
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
    watchs?.forEach((item: any) => {
      PubSub.subscribe(item, (msg: string) => {
        if (visibleWatchs.includes(msg)) {
          setComponentValueAndVisible();
        } else {
          setReFreshKey(Date.now());
        }
      });
    });

    return () => {
      watchs?.forEach((item: any) => {
        PubSub.unsubscribe(item);
      });
    };
  }, [rules, form, visibleRules, watchFn, setComponentValueAndVisible]);

  return (
    <ContainerProvider value={{ rules, form, fieldName, type, refresh: reFreshKey }}>
      {visible
        ? React.cloneElement(children as React.ReactElement<any>, {
            refresh: reFreshKey,
          })
        : null}
    </ContainerProvider>
  );
});

const wrapContainer = React.memo(({ children, rules, fieldName, form, type }: ContainerProps) => {
  const isLeaf = Array.isArray(rules);

  return (
    <>
      {isLeaf ? (
        <Container rules={rules} fieldName={fieldName} form={form} type={type}>
          {children}
        </Container>
      ) : (
        <ContainerProvider value={{ rules, form, fieldName, type }}>{children}</ContainerProvider>
      )}
    </>
  );
});

export default wrapContainer;
