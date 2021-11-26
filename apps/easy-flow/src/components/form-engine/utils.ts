import { FormRuleItem, fieldRule, EventType } from '@type';
import { flowVarsMap } from '@utils';
import { Rule } from 'antd/lib/form';

export interface fieldRulesItem {
  condition: fieldRule[];
  watch: string[];
}

export interface formRulesItem {
  condition: fieldRule[][] & { [key: string]: any };
  watch: string[];
  visible?: boolean;
  value?: null | string | number | Date;
  subtype?: EventType; //0| 1 | 2 | 3 =>设值| 显隐 | 联动 | 启用禁用
  type?: string; // init | change | blur | panelChange
}

export interface formRulesReturn {
  [key: string]: formRulesItem[];
}

export interface fieldRules {
  [key: string]: fieldRulesItem[];
}

export interface fieldRulesReturn {
  [k: string]: fieldRulesItem;
}

export const convertFormRules = (data: FormRuleItem[], components: { config: any; props: any }[]) => {
  const fieldRulesObj: any = {};
  const componentList = components.map((v) => Object.assign({}, v.config, v.props));

  function setFieldRules(fieldName: string, value: any, item: any, type: string, subtype: EventType) {
    const obj = {
      watch: [].concat(value),
      condition: item,
      subtype,
      type,
    };
    if (fieldRulesObj?.[fieldName as string]) {
      fieldRulesObj[fieldName as string].push(obj);
    } else {
      fieldRulesObj[fieldName] = [obj];
    }
  }

  // 表单规则配置
  data?.forEach((item: any) => {
    const { formChangeRule, type, subtype = EventType.Visible } = item;
    if (type === 'change' && subtype === EventType.Visible) {
      // 显隐事件
      const { hideComponents, showComponents, fieldRule } = formChangeRule;
      const watchList = [
        ...(new Set(
          fieldRule
            .flat(2)
            .filter(Boolean)
            .map((item: any) => item.fieldName),
        ) as any),
      ];
      const { parentId = '' } = fieldRule.flat(2).find((item: { [key: string]: any }) => !!item.parentId) || {};
      const component = componentList.find((v) => v.id === parentId);
      const parentFieldName = component?.fieldName || '';

      [showComponents, hideComponents].forEach((components, index) => {
        if (!components) return;
        const obj = {
          watch: watchList,
          condition: fieldRule,
          visible: index !== 1,
          subtype: EventType.Visible,
          type,
        };
        components.forEach((field: any) => {
          if (parentId) {
            if (fieldRulesObj?.[parentFieldName]?.[field]) {
              fieldRulesObj[parentFieldName][field].push(obj);
            } else {
              fieldRulesObj[parentFieldName] = Object.assign({}, fieldRulesObj?.[parentFieldName], {
                [field]: [obj],
              });
            }
            return;
          }
          if (fieldRulesObj?.[field]) {
            fieldRulesObj[field].push(obj);
          } else {
            fieldRulesObj[field] = [obj];
          }
        });
      });
    } else if (type === 'change' && subtype === EventType.Union) {
      // 联动事件
      const { fieldRule } = formChangeRule;
      fieldRule
        .flat(2)
        .filter(Boolean)
        .forEach((item: any) => {
          const { fieldName, value } = item;
          if (!Object.keys(flowVarsMap).includes(value)) {
            setFieldRules(value, fieldName, item, type, 2);
          }
          setFieldRules(fieldName, value, item, type, 2);
        });
    }
  });
  // 属性面板配置
  components?.forEach((com) => {
    const { config } = com;
    // 此处不能用fieldName 预览时没有fieldName字段 统一用id作为key
    if (config.id && config.type === 'InputNumber' && config.defaultNumber) {
      // panel配置公式计算
      const { id, defaultNumber, fieldName } = config;
      const value = defaultNumber.calculateData;
      value && setFieldRules(fieldName || id, value, defaultNumber, 'change', 2);
    }
  });
  return fieldRulesObj;
};

export const validateRules = (isRequired: boolean, label: string, type: string, props: any): Rule[] => {
  const rules: Rule[] = [];

  if (isRequired) {
    // 图片和附件的必填校验特殊处理
    if (['Image', 'Attachment'].includes(type)) {
      rules.push({
        validator(_, value) {
          if (!value || (value?.fileList?.length === 0 && value?.fileIdList?.length === 0)) {
            return Promise.reject(new Error(`请选择上传的${type === 'Image' ? '图片' : '附件'}`));
          }
          return Promise.resolve();
        },
      });
    } else {
      rules.push({
        required: true,
        message: `${label}不能为空`,
      });
    }
  }
  if (type === 'InputNumber' && props.numlimit?.enable) {
    const { numrange } = props.numlimit;
    rules.push({
      validator(_, val) {
        if (val < numrange?.min || val > numrange.max) {
          return Promise.reject(new Error(`请设置数值范围内的数值！`));
        }
        return Promise.resolve();
      },
    });
  }
  return rules;
};
