import { Rule } from "antd/lib/form";

// 名称通用正则校验,请输入3-20位的汉字、字母、数字、下划线
export const nameRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{3,20}$/;
// 名称通用校验规则
export const nameRule: Rule = {
  validator(_, value: string) {
    const name = value?.trim();
    if (!name) {
      return Promise.reject(new Error("请输入"));
    }
    if (!nameRegexp.test(name)) {
      return Promise.reject(
        new Error("请输入3-20位的汉字、字母、数字、下划线")
      );
    }
    return Promise.resolve();
  },
};
// 备注通用校验正则,1-200位汉字、字母、数字、下划线
export const remarkRegexp = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,200}$/;
// 备注通用校验规则
export const remarkRule: Rule = {
  validator(_, value: string) {
    const remark = value?.trim();
    if (remark && !remarkRegexp.test(remark)) {
      return Promise.reject(
        new Error("请输入1-200位的汉字、字母、数字、下划线")
      );
    }
    return Promise.resolve();
  },
};
