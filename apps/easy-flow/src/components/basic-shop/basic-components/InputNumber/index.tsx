import { memo, useMemo } from "react";
import { InputNumberProps } from "antd/lib/input-number";
import EventHoc from "@/components/form-engine/eventHoc";
import { useContainerContext } from "@/components/form-engine/context";
import BaseInputNumber from "./base-input-number";
import { getCalculateNum } from "./utils";

const InputNumberContainer = (props: InputNumberProps & { [key: string]: any }) => {
  const { form, rules, refresh } = useContainerContext();
  const { onChange } = props;
  const propList = useMemo(() => {
    const prop = { ...props };
    setTimeout(() => {
      if (form && rules && refresh !== undefined) {
        const formValue = form.getFieldsValue();
        const numberValue = getCalculateNum(rules, formValue, props.decimal);
        if (numberValue !== undefined && numberValue !== null) {
          prop.value = numberValue;
        }
        onChange && onChange(numberValue!);
      } else if (props?.defaultNumber?.customData === 0 && prop.value === undefined) {
        // 数字控件在1.2.0中需要展示默认值为0进行计算
        // 由于流程提交校验必填项时数字控件的value值没有获取到  此处暂时手动重置
        prop.value = 0;
        onChange && onChange(0);
      }
    }, 0);
    return prop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, props, refresh, rules]);

  return (
    <EventHoc>
      <BaseInputNumber {...propList} />
    </EventHoc>
  );
};

export default memo(InputNumberContainer);
