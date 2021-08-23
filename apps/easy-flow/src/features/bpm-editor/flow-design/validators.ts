import { Rule } from 'antd/lib/form';
import { CorrelationMemberConfig } from '@type/flow';
import { validName } from '@common/rule';

const member = (value: CorrelationMemberConfig): string => {
  const { members = [], depts = [], roles = [] } = value;

  if (!members.length && !depts.length && !roles.length) {
    return '办理人不能为空';
  }

  return '';
};

export const validators = {
  member,
  name: validName,
};

export const rules: { [key: string]: Rule } = {
  member: {
    validator(_, value: CorrelationMemberConfig) {
      const message = validators.member(value);

      if (message) {
        return Promise.reject(new Error(message));
      }

      return Promise.resolve();
    },
  },
  name: {
    validator: (_, value: string) => {
      const message = validName(value);

      if (message) {
        return Promise.reject(new Error(message));
      } else {
        return Promise.resolve();
      }
    },
  },
};
