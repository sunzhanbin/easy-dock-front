import { Rule } from 'antd/lib/form';
import { CorrelationMemberConfig, AuditNode, RevertType } from '@type/flow';
import { DataConfig } from '@type/api';
import { validName } from '@common/rule';
import { dynamicIsEmpty } from './util';

const member = (value: CorrelationMemberConfig): string => {
  const { members = [], depts = [], roles = [], dynamic } = value;

  if (!members.length && !depts.length && !roles.length && dynamicIsEmpty(dynamic)) {
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

const revert = (value: AuditNode['revert']) => {
  if (value.type === RevertType.Specify && !value.nodeId) {
    return '选择驳回到指定节点时指定节点不能为空';
  }

  return '';
};

export const validators = {
  member,
  name: validName,
  data: dataPushConfig,
  revert: revert,
};

function handleValidWithMessage(message: string) {
  if (message) {
    return Promise.reject(new Error(message));
  }

  return Promise.resolve();
}

export const rules: { [key: string]: Rule } = {
  member: {
    validator(_, value: CorrelationMemberConfig) {
      return handleValidWithMessage(validators.member(value));
    },
  },

  name: {
    validator: (_, value: string) => {
      return handleValidWithMessage(validators.name(value));
    },
  },
  revert: {
    validator(_, value: AuditNode['revert']) {
      return handleValidWithMessage(validators.revert(value));
    },
  },
};
