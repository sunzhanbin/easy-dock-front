export  const convertFormRules = (data: any = []) => {
  const formRulesObj: any = {}
  data?.map((item: any) => {
    var {formChangeRule, type} = item;
    if(type !== 'change') return;
    var { hideComponents, showComponents, fieldRule} = formChangeRule;
    var watchList = [...new Set(fieldRule.flat(2).filter(Boolean).map((item: any) => item.fieldName)) as any];

    [showComponents, hideComponents].map((components, index) => {
        if(!components) return;
            components.map((field: any) => {
            if(formRulesObj?.[field]) {
                formRulesObj[field].push({
                    visible: index == 1 ? false: true,
                    watch: watchList,
                    condition:fieldRule,
                    value: null,
                })
            } else {
                formRulesObj[field] = [{
                    visible: index == 1 ? false: true,
                    watch: watchList,
                    condition: fieldRule,
                    value: null,
                }]
            }
        })
    })
  })

  return formRulesObj;
};

export const convertFieldRules = (data: any = []) => {
  const formRulesObj: any = {}
  data?.map((item: any) => {
    var {formChangeRule, type} = item;
    if(type !== 'change') return;
    var {fieldRule} = formChangeRule;
    fieldRule.flat(2).filter(Boolean).map((item: any) => {
        const {fieldName, value} = item;
        if(formRulesObj?.[fieldName]) {
            formRulesObj[fieldName].push({
                watch: [value],
                condition: item,
                type,
            })
        } else {
            formRulesObj[fieldName] = [{
                watch: [value],
                condition: item,
                type,
            }]
        }
    })
  });
  return Object.fromEntries(Object.entries(formRulesObj).map((item: any) => {
    var [key, value] = item;
    var newValue = value.reduce((m: any, n: any) => {
        var watch = [...new Set(m.watch.concat(n.watch)) as any];
        var condition = [
            ...m.condition,
            n.condition,
        ]
        return {
            watch,
            condition,
            type: n?.type
        }
    }, {
        watch: [],
        condition: []
    })
    return [key, newValue];
  }));
}