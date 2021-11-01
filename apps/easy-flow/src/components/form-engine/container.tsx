import React, { useCallback, useEffect, useMemo, useState } from "react";
import PubSub from 'pubsub-js';
import {analysisFormChangeRule} from '@/utils';
import {ContainerProvider} from './context';

const Container = ({children, rules, name, form, type}: {children?: any, form?: any, name: string, type?: string, rules?: any}) => {

  const formRules = useMemo(() => rules.formRules, [rules]);
  const fieldRules = useMemo(() => rules.fieldRules, [rules]);
  const [visible, setVisible] = useState(true);
  const [comProps, setComProps] = useState({});
  
  const currentCondition = useMemo(() => formRules && formRules[formRules.length - 1], [formRules]);

  const setComponentProps = useCallback(() => {
    const conditions = fieldRules.condition;
    const formValues = form.getFieldsValue();
    const type = fieldRules.type;
    let comProps: any = {};

    conditions?.forEach((item: any) => {  
      switch (type) {
        case 'Date': {
          const {symbol, value} = item;
          comProps = {
            startTime: undefined,
            endTime: undefined
          }

          if(symbol == "latter") {
            comProps.endTime = formValues[value] || value;
          } else if(symbol == 'earlier') {
            comProps.startTime = formValues[value] || value;
          } 
        break;
      }
      
        default:
          break;
      }
    })
    setComProps(comProps);

  }, []);

  const setComponentValueAndVisible = useCallback(() => {
    if (!currentCondition) return;
    const {value, visible, condition} = currentCondition;
    const formValues = form.getFieldsValue();
    const isMatch = analysisFormChangeRule(condition, formValues);
    if (isMatch) {
      setVisible(visible);

      // 给当前组件设置值；
      if(visible && value) {
        const fieldValue = {
          [name]: value,
        }
        form.setFieldsValue(fieldValue)
      }
    } else {
      setVisible(!visible)
    };
  }, [currentCondition]);

  // const formToItemFn = useCallback(() => {
  //   setComponentValueAndVisible()

  // }, [setComponentValueAndVisible]);

  useEffect(() => {
    if(!formRules) return;

    const formWatchs = formRules.reduce((a: any, b: any) => a.concat(b.watch), []);
    const fieldWatchs = fieldRules.watch;

    const watchs = [...new Set(formWatchs.concat(fieldWatchs).filter(Boolean)) as any];

    watchs?.map((item: any) => {
      PubSub.subscribe(item, (msg: string, data: any) => {
        if(formWatchs.includes(msg)) {
          setComponentValueAndVisible();
        }
        if(fieldWatchs.includes(msg)) {
          setComponentProps();
        }
      })
    })

    return () => {
      watchs?.map((item: any) => {
        PubSub.unsubscribe(item)
      })
    }
  })
  
  return (
    <ContainerProvider value={{deadline: 111}}>
      {
        visible ? React.cloneElement(children, {...comProps}): null
      }
    </ContainerProvider>
  )
};
export default Container;


