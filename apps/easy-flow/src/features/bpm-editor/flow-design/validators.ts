import { Rule } from 'antd/lib/form';
import { CorrelationMemberConfig } from '@type/flow';
import { DataConfig } from '@type/api';
import { validName } from '@common/rule';

const member = (value: CorrelationMemberConfig): string => {
  const { members = [], depts = [], roles = [] } = value;

  if (!members.length && !depts.length && !roles.length) {
    return '办理人不能为空';
  }

  return '';
};

const dataPushConfig = (value: DataConfig): string => {
  const { api, request: { required = [], customize = [] } = {} } = value || {};

  if (!api) {
    return '推送数据的接口的不能为空';
  }

  let message = '';

  [...required, ...customize].some((param) => {
    if (!param.name || !param.location || !param.map) {
      message = '推送数据配置不合法';

      return true;
    }

    return false;
  });

  return message;
};

export const validators = {
  member,
  name: validName,
  data: dataPushConfig,
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
