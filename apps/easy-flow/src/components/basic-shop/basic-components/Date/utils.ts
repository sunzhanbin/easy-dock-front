// const handleDisabledDate = useMemoCallback((current, props) => {
//   const {id} = props.props
//   if (!id || !current) return false
//   const formValues = form.getFieldsValue();
//   if (changeFieldRuleList.length && Object.keys(formValues).length) {
//     const fieldRules = _.uniqWith(changeFieldRuleList.map((rule) => {
//       return rule && collectFieldList(rule.fieldRule);
//     }).flat(2), _.isEqual)
//     // 去重
//     const filterRules = fieldRules.filter(item => item && (item.fieldName === id || item.value === id))
//     let rules1, rules2, rules3, rules4;
//     filterRules.forEach(item => {
//       if (item?.symbol === 'earlier') {
//         if (item.fieldName === id) {
//           rules1 = current.valueOf() >= formValues[item.value as string]
//         }
//         if (item.value === id && item.fieldName) {
//           rules2 = current.valueOf() <= formValues[item.fieldName]
//         }
//       }
//       if (item?.symbol === 'latter') {
//         if (item.fieldName === id) {
//           rules3 = current.valueOf() <= formValues[item.value as string]
//         }
//         if (item.value === id && item.fieldName) {
//           rules4 = current.valueOf() >= formValues[item.fieldName]
//         }
//       }
//     })
//     return rules2 || rules4 || rules1 || rules3
//   }
// })

import { flowVarsMap } from '@utils';

type RuleParams = {
  rules: { [key: string]: any }[];
  formValue: { [key: string]: any };
};
const getDisabledDateRule = ({ rules, formValue }: RuleParams): boolean | undefined => {
  // console.log(rules, formValue);
  rules.forEach((item) => {});
  // Object.keys(flowVarsMap)
  return;
};
export default getDisabledDateRule;
