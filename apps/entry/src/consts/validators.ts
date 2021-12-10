import { Rule } from "antd/lib/form";

export const nameRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/; //请输入1-30位的汉字、字母、数字、下划线
// 通用名称校验规则,1-30位
export const nameRule: Rule = {
  validator(_, value: string) {
    const name = value?.trim();
    if (!name) {
      return Promise.reject(new Error("请输入"));
    }
    if (!nameRegexp.test(value)) {
      return Promise.reject(
        new Error("请输入3-20位的汉字、字母、数字、下划线")
      );
    }
    return Promise.resolve();
  },
};
