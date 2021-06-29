import { Rule } from 'antd/lib/form';

export const name: Rule = {
  required: true,
  validator: (_, value: string) => {
    if (validName(value)) {
      return Promise.reject(new Error('节点名称为1-30位汉字、字母、数字、下划线'));
    } else {
      return Promise.resolve();
    }
  },
};

export const validName = (value: string) => {
  if (!value || value.length > 30 || /[^\u4e00-\u9fa5_\d\w]/.test(value)) {
    return '节点名称为1-30位汉字、字母、数字、下划线';
  } else {
    return '';
  }
};
