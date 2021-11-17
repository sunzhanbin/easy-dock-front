import { FormRuleItem, fieldRule, PropertyRuleItem } from '@type';
import { flowVarsMap } from '@utils';

export interface fieldRulesItem {
  condition: fieldRule[];
  watch: string[];
}

export interface formRulesItem {
  condition: fieldRule[][] & { [key: string]: any };
  watch: string[];
  visible?: boolean;
  value?: null | string | number | Date;
  subtype?: number; // 0 | 1 | 2 => 显隐 | 启禁 | 联动；
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
  const componentList = components.map((v) => v.config);

  function setFieldRules(fieldName: string, value: any, item: any, type: string, subtype: number) {
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
    const { formChangeRule, type, subtype = 0 } = item;
    if (type === 'change' && subtype === 0) {
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
          subtype: 0,
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
    } else if (type === 'change' && subtype === 2) {
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
    if (config.fieldName && config.type === 'InputNumber' && config.defaultNumber) {
      // panel配置公式计算
      const { fieldName, defaultNumber } = config;
      const value = defaultNumber.calculateData;
      value && setFieldRules(fieldName, value, defaultNumber, 'change', 2);
    }
    console.log(config, 'config');
  });
  return fieldRulesObj;
};
