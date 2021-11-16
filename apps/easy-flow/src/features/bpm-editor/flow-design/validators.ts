import { Rule } from 'antd/lib/form';
import { CorrelationMemberConfig, AuditNode, RevertType, TriggerConfig, IDueConfig } from '@type/flow';
import { ApiType, DataConfig } from '@type/api';
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
  const { type, id, url, method, request: { required = [], customize = [] } = {} } = value || {};

  if (type !== ApiType.CUSTOM && !id) {
    return '推送数据的接口的不能为空';
  }

  if (type === ApiType.CUSTOM) {
    if (!url) {
      return '推送数据的接口地址的不能为空';
    }
    const urlRegex = /(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/;
    if (!urlRegex.test(url)) {
      return '请输入正确的接口地址';
    }
    if (!method) {
      return '请选择请求方式';
    }
  }

  let message = '';

  const isInvalid = [...required, ...customize].some((param) => {
    if (!param.name || !param.location || !param.map) {
      message = '推送数据配置不合法';

      return true;
    }

    return false;
  });

  if (isInvalid) {
    return message;
  }

  return '';
};

const revert = (value: AuditNode['revert']) => {
  if (value.type === RevertType.Specify && !value.nodeId) {
    return '选择驳回到指定节点时指定节点不能为空';
  }

  return '';
};

const triggerConfig = (value: TriggerConfig[]): string => {
  if (!value || value.length < 1) {
    return '请选择触发流程';
  }
  const lackProcessId = value.some((v) => !v.id);
  if (lackProcessId) {
    return '请选择触发流程';
  }
  const lackFields = value.some((v) => {
    if (v.mapping?.length > 0) {
      return v.mapping.some((k) => !k.current || !k.target);
    }
    return false;
  });
  if (lackFields) {
    return '请选择对应字段';
  }
  const lackMember = value.some((v) => {
    if (v.starter.type === 3) {
      return !v.starter.value;
    }
  });
  if (lackMember) {
    return '请选择表单内人员控件';
  }
  return '';
};

const timeoutConfig = (value: IDueConfig) => {
  if (value.enable) {
    if (!value.timeout.num) {
      return '请输入超时时间';
    }
    if (value.cycle.enable && !value.cycle.num) {
      return '请输入超时时间';
    }
    if (value.notice.other && (!value.notice.users || value.notice.users.length === 0)) {
      return '请选择其他人员';
    }
    return '';
  }
  return '';
};

export const validators = {
  member,
  timeoutConfig,
  name: validName,
  data: dataPushConfig,
  config: triggerConfig,
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
