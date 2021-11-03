import { FormRuleItem, fieldRule } from '@type';

export interface fieldRulesItem {
  condition: fieldRule[];
  watch: string[];
}

export interface formRulesItem {
  condition: fieldRule[][];
  watch: string[];
  visible?: boolean;
  value?: null | string | number | Date;
  subtype?: number; // 0 | 1 | 2 => 显隐 | 启停 | 联动；  
  type?: string; // init | change | blur
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

export const convertFormRules = (data: FormRuleItem[] =  []) => {
  const fieldRulesObj: formRulesReturn = {};

  function setFieldRules(fieldName: string, value: any, item: any, type: string) {
    const obj = {
      watch: [value],
      condition: item,
      subtype: 1,
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
    var { formChangeRule, type, subtype = 0 } = item;
    if (type == 'change' && subtype == 0) {
      var { hideComponents, showComponents, fieldRule } = formChangeRule;
      var watchList = [
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
          visible: index == 1 ? false : true,
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
      var { fieldRule } = formChangeRule;
      fieldRule
      .flat(2)
      .filter(Boolean)
      .map((item: any) => {
        const { fieldName, value } = item;
        setFieldRules(fieldName, value, item, type);
        setFieldRules(value, fieldName, item, type);
      });
    }
  });
  return fieldRulesObj;
};

