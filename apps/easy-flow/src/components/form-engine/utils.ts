import { FormRuleItem, fieldRule } from '@type';

export interface fieldRulesItem {
  condition: fieldRule[];
  watch: string[];
}

export interface formRulesItem {
  condition: fieldRule[][] & { [key: string]: any };
  watch: string[];
  visible?: boolean;
  value?: null | string | number | Date;
  subtype?: number; // 0 | 1 | 2 => 显隐 | 启停 | 联动；  
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

export const convertFormRules = (data: FormRuleItem[] = [], components: { config: any; props: any }[]) => {
  const fieldRulesObj: formRulesReturn = {};

  function setFieldRules(fieldName: string, value: any, item: any, type: string, subtype: number) {
    const obj = {
      watch: [].concat(value),
      condition: item,
      subtype,
      type
    }
    if (fieldRulesObj?.[fieldName as string]) {
      fieldRulesObj[fieldName as string].push(obj);
    } else {
      fieldRulesObj[fieldName] = [
        obj
      ];
    }
  }
  data?.map((item: any) => {
    const {formChangeRule, type, subtype = 0} = item;
    if (type == 'change' && subtype == 0) {
      const {hideComponents, showComponents, fieldRule} = formChangeRule;
      const watchList = [
        ...(new Set(
          fieldRule
            .flat(2)
            .filter(Boolean)
            .map((item: any) => item.fieldName),
        ) as any),
      ];
      [showComponents, hideComponents].map((components, index) => {
        if (!components) return;
        const obj = {
          watch: watchList,
          condition: fieldRule,
          visible: index !== 1,
          subtype: 0,
          type
        };
        components.map((field: any) => {
          if (fieldRulesObj?.[field]) {
            fieldRulesObj[field].push(obj);
          } else {
            fieldRulesObj[field] = [obj];
          }
        });
      });
    } else if(type == 'change' && subtype == 1) {
      const {fieldRule} = formChangeRule;
      fieldRule
        .flat(2)
        .filter(Boolean)
        .map((item: any) => {
          const {fieldName, value} = item;
          setFieldRules(fieldName, value, item, type, 1);
          setFieldRules(value, fieldName, item, type, 1);
        });
    }
  });
  // panel配置公式计算
  components?.map(com => {
    const {config} = com
    if (!config?.defaultNumber) return
    const fieldName = config.id
    const value = config?.defaultNumber.calculateData
    value && setFieldRules(fieldName, value, config?.defaultNumber, 'change', 2)
  })
  console.log(fieldRulesObj, 'field*******************')
  return fieldRulesObj;
};

