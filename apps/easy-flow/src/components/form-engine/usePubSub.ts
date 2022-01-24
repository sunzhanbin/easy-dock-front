import { useEffect } from "react";
import PubSub from "pubsub-js";
import { useContainerContext } from "./context";
import { EventType } from "@/type";

/* 

  @params: handleValue, handleVisible, handleRules;

  @return: rules, form, fieldName, type;

  @example：
  const handleValue: (msg: string, data: any) => void = (msg: string, data: any) => {};
  const handleVisible: (msg: string, data: any) => void = (msg: string, data: any) => {};
  const handleRules: (msg: string, data: any) => void = (msg: string, data: any) => {};
  const {rules, form, fieldName, type} = usePubSub({handleValue, handleVisible, handleRules});
*/
const usePubSub = (props: any) => {
  const { rules, form, fieldName, type } = useContainerContext();

  const { handleValue, handleVisible, handleRules } = props;

  useEffect(() => {
    if (!rules) return;

    // @Todo:暂时放在这里，粗略实现，后期如果需要再使用该方案；

    const watchs = [...new Set(rules.reduce((a: string[], b: any) => a.concat(b.watch), [] as string[]))];

    // // @Todo: watchs 需要再次过滤，因为 value 可能不是依赖项，需要从当前表单里筛选；

    watchs?.map((item: any) => {
      PubSub.subscribe(item, (msg: string, data: any) => {
        const { subtype } = item;
        if (subtype == EventType.Available) {
          // 隐藏；
          handleValue(msg, data);
        } else if (subtype == EventType.Visible) {
          // 显隐；
          handleVisible(msg, data);
        } else if (subtype == EventType.Union) {
          // 规则处理；
          handleRules(msg, data);
        }
      });
      return item;
    });

    return () => {
      watchs?.map((item: any) => {
        PubSub.unsubscribe(item);
        return item;
      });
    };
  }, [rules, handleRules, handleValue, handleVisible]);

  return {
    rules,
    form,
    fieldName,
    type,
  };
};

export default usePubSub;
