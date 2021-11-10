import * as math from 'mathjs';

// 公式计算函数
export const getCalculateNum = (
  calcType: string,
  watch: any[],
  formValue: { [key: string]: any },
  changeType: string,
): number => {
  let returnNum = undefined;
  let formListMap = { ...formValue };
  Object.keys(formListMap).map((item) => {
    if (!watch.includes(item)) {
      // 非嵌套类型控件
      delete formListMap[item];
    } else {
      // console.log(formListMap[item], 'formListMap[item]');
      // const fieldItem = formListMap[item][0];
      // Object.entries(fieldItem).map(([fieldKey, fieldValue]: any) => {
      //   if (watch.includes(fieldKey)) {
      //     formListMap[item] = fieldValue;
      //   }
      // });
      // changeType
      // formListMap
    }
  });
  const filterList = Object.values(formListMap).filter((item) => !!item);
  if (calcType === 'minus') {
    if (changeType.includes('Date')) {
      if (filterList.length < 2) return 0;
      const rangeDateNum = Object.values(formListMap).reduceRight((p: any, n: any) => p - n);
      returnNum = Math.floor(rangeDateNum / (1000 * 3600 * 24));
    } else {
      returnNum = filterList.reduceRight((p: any, n: any) => p - n);
    }
  } else if (calcType === 'add') {
    returnNum = math.sum(filterList);
  } else if (calcType === 'sum') {
    returnNum = math.sum(filterList);
  } else if (calcType === 'average') {
    returnNum = math.mean(filterList);
  } else if (calcType === 'count') {
    returnNum = filterList.join(',');
  } else if (calcType === 'max') {
    returnNum = math.max(filterList);
  } else if (calcType === 'min') {
    returnNum = math.min(filterList);
  } else if (calcType === 'deduplicate') {
    returnNum = [...new Set(...filterList)].join(',');
  }
  return returnNum;
};
