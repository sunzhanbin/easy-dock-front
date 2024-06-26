import * as math from "mathjs";

// 公式计算函数
export const getCalculateNum = (
  rules: { [key: string]: any }[],
  formValue: { [key: string]: any },
  decimal: { [key: string]: any },
): number | undefined => {
  const rule = rules.find((rule) => rule.condition.calcType);
  if (!rule || !rule.condition.calcType) return undefined;
  const {
    watch,
    condition: { calcType },
  } = rule;
  let returnNum = undefined;
  let formListMap: { [key: string]: any } = {};
  watch?.forEach((item: string) => {
    if (item.includes("Tab")) {
      const parentName = item.split(".")[0];
      const fieldName = item.split(".")[1];
      const fieldList = formValue[parentName];
      if (!fieldList) return;
      formListMap = fieldList.map((item: { [x: string]: any }) => item[fieldName]);
    } else {
      formListMap[item] = item.includes("InputNumber") ? formValue[item] || 0 : formValue[item];
    }
  });
  const filterList = Object.values(formListMap).filter((v) => v !== undefined && v !== null);
  if (!filterList.length) return undefined;
  if (calcType === "minus") {
    if (watch.find((item: string) => item.includes("Date"))) {
      if (filterList.length < 2) return undefined;
      const rangeDateNum = Object.values(formListMap).reduceRight((p: any, n: any) => n - p);
      returnNum = (rangeDateNum / (1000 * 3600 * 24)).toFixed(0);
    } else {
      returnNum = filterList.reverse().reduceRight((p: any, n: any) => p - n);
    }
  } else if (calcType === "add") {
    returnNum = math.sum(filterList);
  } else if (calcType === "sum") {
    returnNum = math.sum(filterList);
  } else if (calcType === "average") {
    returnNum = math.mean(filterList);
  } else if (calcType === "count") {
    returnNum = filterList.length;
  } else if (calcType === "max") {
    returnNum = math.max(filterList);
  } else if (calcType === "min") {
    returnNum = math.min(filterList);
  } else if (calcType === "deduplicate") {
    returnNum = [...new Set(filterList)].length;
  }
  const precision = decimal && decimal.enable ? decimal.precision : 0;
  if (precision !== undefined && returnNum) {
    returnNum = Number(returnNum)?.toFixed(precision);
  }
  return returnNum;
};
