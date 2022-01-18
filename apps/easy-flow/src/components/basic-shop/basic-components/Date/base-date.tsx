import { memo, ReactNode, useMemo } from "react";
import { DatePicker } from "antd";
import { Icon } from "@common/components";
import { DatePickerProps } from "antd/lib/date-picker";
import moment, { Moment } from "moment";
import { getPopupContainer } from "@utils";

const DateComponent = (props: DatePickerProps & { onChange: (value?: number) => void }) => {
  const { format, defaultValue, value, onChange, disabledDate } = props;
  const propList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const prop: { [k: string]: string | boolean | Function | Moment | ReactNode } = {
      size: "large",
      suffixIcon: <Icon type="riqi" />,
      getPopupContainer: getPopupContainer,
      onChange(val: moment.Moment) {
        const time = moment(val).format(format as string);
        onChange && onChange(val ? moment(time).valueOf() : undefined);
      },
    };
    let formatStr = "";
    if (format === "yyyy-MM-DD HH:mm:ss") {
      prop.showTime = true;
      formatStr = "yyyy-MM-DD HH:mm:ss";
    } else if (format === "yyyy-MM-DD") {
      formatStr = "yyyy-MM-DD";
    } else {
      formatStr = "yyyy-MM-DD";
    }
    prop.format = formatStr;
    if (defaultValue) {
      prop.defaultValue = typeof defaultValue === "number" ? moment(defaultValue) : defaultValue;
    }
    if (value) {
      prop.value = typeof value === "number" ? moment(value) : value;
    }

    return Object.assign({}, props, prop);
  }, [format, defaultValue, value, props, onChange]);
  return (
    <DatePicker {...propList} style={{ width: "100%" }} key={defaultValue?.toString()} disabledDate={disabledDate} />
  );
};
export default memo(DateComponent);
