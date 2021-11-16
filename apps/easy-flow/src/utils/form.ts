import { batchUpload, downloadFile as download } from '@/apis/file';
import { ImageValue } from '@/components/basic-shop/basic-components/Image';
import { DateField, fieldRule, FormField, SelectOptionItem } from '@/type';
// import { FieldAuthsMap } from '@/type/flow';
import moment from 'moment';
import { runtimeAxios } from './axios';
import { DATE_DEFAULT_FORMAT } from '@utils/const';

// 格式化单个条件value
export function formatRuleValue(
  rule: fieldRule,
  field: FormField,
  fieldNext?: FormField,
): { name: string | undefined; symbol: string; value?: string } {
  const { symbol, value } = rule;
  const name = field.label;
  const fieldType = field.type as string;
  const label = (rule.symbol && symbolMap[rule.symbol].label) || '';
  if (symbol === 'null' || symbol === 'notNull') {
    return { name, symbol: label };
  }
  // 文本类型
  if (fieldType === 'Input' || fieldType === 'Textarea') {
    if (symbol === 'equal' || symbol === 'unequal' || symbol === 'include' || symbol === 'exclude') {
      return { name, symbol: label, value: value as string };
    }
    if (symbol === 'equalAnyOne' || symbol === 'unequalAnyOne') {
      const text = ((value as string[]) || []).join('、');
      return { name, symbol: label, value: text };
    }
  }
  // 数字类型
  if (fieldType === 'InputNumber' && value !== undefined) {
    if (symbol === 'range') {
      const [min, max] = value as [number, number];
      return { name, symbol: label, value: `>=${min}且<=${max}` };
    }
    return { name, symbol: label, value: value as string };
  }
  // 日期类型
  if (fieldType === 'Date') {
    const format = (field as DateField)?.format || 'YYYY-MM-DD';
    if (symbol === 'range') {
      const [start, end] = (value as [number, number]) || [0, 0];
      const startTime = start ? moment(start).format(format) : '';
      const endTime = end ? moment(end).format(format) : '';
      return { name, symbol: label, value: startTime ? `在${startTime}和${endTime}之间` : '' };
    }
    if (symbol === 'dynamic') {
      const text = dynamicMap[value as string]?.label || '';
      return { name, symbol: label, value: text ? `在${text}之内` : '' };
    }
    if (symbol === 'earlier' || symbol === 'latter') {
      const value = fieldNext?.label;
      return { name, symbol: label, value: value || '' };
    }
    const text = moment(value as number).format(format);
    return { name, symbol: label, value: value ? text : '' };
  }
  // 选项类型
  if (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'Checkbox') {
    if (symbol === 'equal' || symbol === 'unequal' || symbol === 'include' || symbol === 'exclude') {
      if (Array.isArray(value)) {
        const text = ((value as string[]) || []).join('、');
        return { name, symbol: label, value: text };
      }
      return { name, symbol: label, value: value as string };
    }
    if (symbol === 'equalAnyOne' || symbol === 'unequalAnyOne') {
      const text = ((value as string[]) || []).join('、');
      return { name, symbol: label, value: text };
    }
  }
  return { name, symbol: label };
}

// 条件符号映射
export const symbolMap: { [k in string]: { value: string; label: string } } = {
  equal: { value: 'equal', label: '等于' },
  unequal: { value: 'unequal', label: '不等于' },
  greater: { value: 'greater', label: '大于' },
  greaterOrEqual: { value: 'greaterOrEqual', label: '大于等于' },
  less: { value: 'less', label: '小于' },
  lessOrEqual: { value: 'lessOrEqual', label: '小于等于' },
  latter: { value: 'latter', label: '不早于' },
  earlier: { value: 'earlier', label: '不晚于' },
  range: { value: 'range', label: '选择范围' },
  dynamic: { value: 'dynamic', label: '动态筛选' },
  equalAnyOne: { value: 'equalAnyOne', label: '等于任意一个' },
  unequalAnyOne: { value: 'unequalAnyOne', label: '不等于任意一个' },
  include: { value: 'include', label: '包含' },
  exclude: { value: 'exclude', label: '不包含' },
  null: { value: 'null', label: '为空' },
  notNull: { value: 'notNull', label: '不为空' },
};

export const dynamicMap: { [k in string]: { value: string; label: string } } = {
  today: { value: 'today', label: '今天' },
  yesterday: { value: 'yesterday', label: '昨天' },
  thisWeek: { value: 'thisWeek', label: '本周' },
  lastWeek: { value: 'lastWeek', label: '上周' },
  thisMonth: { value: 'thisMonth', label: '本月' },
  lastMonth: { value: 'lastMonth', label: '上月' },
  thisYear: { value: 'thisYear', label: '今年' },
  lastYear: { value: 'lastYear', label: '去年' },
  last7days: { value: 'last7days', label: '最近7天' },
  last30days: { value: 'last30days', label: '最近30天' },
  last90days: { value: 'last90days', label: '最近90天' },
};

export const datePropertyMap: { [k in string]: { value: string; label: string } } = {
  flowVars: { value: 'flowVars', label: '流程变量' },
  other: { value: 'other', label: '其他控件' },
};

export const flowVarsMap: { [k in string]: { value: string; label: string } } = {
  currentMonth: { value: 'currentMonth', label: '当前月' },
  currentYear: { value: 'currentYear', label: '当前年' },
  currentTime: { value: 'currentTime', label: '当前时间' },
};

// 解析文本类型规则
function analysisTextRule(symbol: string, value: string | string[], formValue: string): boolean {
  let result = false;
  switch (symbol) {
    case 'equal':
      result = formValue === (value as string);
      break;
    case 'unequal':
      result = formValue !== (value as string);
      break;
    case 'equalAnyOne':
      result = (value as string[]).includes(formValue);
      break;
    case 'unequalAnyOne':
      result = !(value as string[]).includes(formValue);
      break;
    case 'include':
      result = formValue.indexOf(value as string) > -1;
      break;
    case 'exclude':
      result = formValue.indexOf(value as string) === -1;
      break;
    case 'null':
      result = formValue === undefined || formValue.trim() === '';
      break;
    case 'notNull':
      result = formValue !== undefined && formValue.trim() !== '';
      break;
    default:
      result = false;
      break;
  }
  return result;
}
// 解析数字类型规则
function analysisNumberRule(symbol: string, value: number | [number, number], formValue: number): boolean {
  let result = false;
  switch (symbol) {
    case 'equal':
      result = formValue === (value as number);
      break;
    case 'unequal':
      result = formValue !== (value as number);
      break;
    case 'greater':
      result = formValue > (value as number);
      break;
    case 'greaterOrEqual':
      result = formValue >= (value as number);
      break;
    case 'less':
      result = formValue < (value as number);
      break;
    case 'lessOrEqual':
      result = formValue <= (value as number);
      break;
    case 'range':
      const [min, max] = value as [number, number];
      result = formValue >= min && formValue <= max;
      break;
    case 'null':
      result = formValue === undefined || formValue === null;
      break;
    case 'notNull':
      result = formValue !== undefined && formValue !== null;
      break;
    default:
      result = false;
      break;
  }
  return result;
}
// 解析时间类型规则
function analysisDateRule(symbol: string, value: number | [number, number] | string, formValue: number): boolean {
  let result = false;
  switch (symbol) {
    case 'equal':
      result = formValue === (value as number);
      break;
    case 'unequal':
      result = formValue !== (value as number);
      break;
    case 'greaterOrEqual':
      result = formValue >= (value as number);
      break;
    case 'lessOrEqual':
      result = formValue <= (value as number);
      break;
    case 'range':
      const [startTime, endTime] = value as [number, number];
      result = formValue >= startTime && formValue <= endTime;
      break;
    case 'dynamic':
      const [start, end] = getDynamicTimeRange(value as string);
      result = formValue >= start && formValue <= end;
      break;
    case 'null':
      result = formValue === undefined;
      break;
    case 'notNull':
      result = formValue !== undefined;
      break;
    default:
      result = false;
  }
  return result;
}
// 获取动态范围的起止时间
function getDynamicTimeRange(dynamic: string): [number, number] {
  let startTime, endTime, startDay, endDay;

  switch (dynamic) {
    case 'today':
      startTime = moment().startOf('day').format('x');
      endTime = moment().endOf('day').format('x');
      break;
    case 'yesterday':
      startDay = moment().subtract(1, 'day').format('YYYY-MM-DD');
      endDay = moment().subtract(1, 'day').format('YYYY-MM-DD');
      startTime = moment(startDay).startOf('day').format('x');
      endTime = moment(endDay).endOf('day').format('x');
      break;
    case 'thisWeek':
      startTime = moment().startOf('week').format('x');
      endTime = moment().endOf('week').format('x');
      break;
    case 'lastWeek':
      const lastWeekDay = moment().subtract(1, 'week').format('YYYY-MM-DD');
      startTime = moment(lastWeekDay).startOf('day').format('x');
      endTime = moment(lastWeekDay).endOf('day').format('x');
      break;
    case 'thisMonth':
      startTime = moment().startOf('month').format('x');
      endTime = moment().endOf('month').format('x');
      break;
    case 'lastMonth':
      const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');
      startTime = moment(lastMonth).startOf('day').format('x');
      endTime = moment(lastMonth).endOf('day').format('x');
      break;
    case 'thisYear':
      startTime = moment().startOf('year').format('x');
      endTime = moment().endOf('year').format('x');
      break;
    case 'lastYear':
      const lastYear = moment().subtract(1, 'year').format('YYYY-MM-DD');
      startTime = moment(lastYear).startOf('day').format('x');
      endTime = moment(lastYear).endOf('day').format('x');
      break;
    case 'last7days':
      startDay = moment().subtract(6, 'day').format('YYYY-MM-DD');
      endDay = moment().subtract(0, 'day').format('YYYY-MM-DD');
      startTime = moment(startDay).startOf('day').format('x');
      endTime = moment(endDay).endOf('day').format('x');
      break;
    case 'last30days':
      startDay = moment().subtract(29, 'day').format('YYYY-MM-DD');
      endDay = moment().subtract(0, 'day').format('YYYY-MM-DD');
      startTime = moment(startDay).startOf('day').format('x');
      endTime = moment(endDay).endOf('day').format('x');
      break;
    case 'last90days':
      startDay = moment().subtract(89, 'day').format('YYYY-MM-DD');
      endDay = moment().subtract(0, 'day').format('YYYY-MM-DD');
      startTime = moment(startDay).startOf('day').format('x');
      endTime = moment(endDay).endOf('day').format('x');
      break;
    default:
      startTime = moment('1970-01-01').startOf('day').format('x');
      endTime = moment('2200-12-31').startOf('day').format('x');
      break;
  }
  return [+startTime, +endTime];
}
function arraySort(v: string[]): string {
  return v.join('').split('').sort().join('');
}
// 解析选项类型规则
function analysisOptionRule(symbol: string, value: string | string[], formValue: string | string[]): boolean {
  let result = false;
  switch (symbol) {
    case 'equal':
      if (Array.isArray(formValue)) {
        // 复选框或者下拉框多选
        result = arraySort(formValue) === arraySort(value as string[]);
      } else {
        // 单选按钮或者下拉框单选
        result = formValue === (value as string);
      }
      break;
    case 'unequal':
      if (Array.isArray(formValue)) {
        result = arraySort(formValue) === arraySort(value as string[]);
      } else {
        result = formValue !== (value as string);
      }
      break;
    case 'equalAnyOne':
      if (Array.isArray(formValue)) {
        result = (value as string[]).some((val) => formValue.toString() === val);
      } else {
        result = (value as string[]).includes(formValue);
      }
      break;
    case 'unequalAnyOne':
      if (Array.isArray(formValue)) {
        result = (value as string[]).every((val) => formValue.toString() !== val) && formValue.length <= 1;
      } else {
        result = !(value as string[]).includes(formValue);
      }
      break;
    case 'include':
      if (Array.isArray(formValue)) {
        result = formValue.some((val) => val.indexOf(value as string) > -1);
      } else {
        result = Boolean(formValue.trim()) && formValue.indexOf(value as string) > -1;
      }
      break;
    case 'exclude':
      if (Array.isArray(formValue)) {
        result = formValue.every((val) => val.indexOf(value as string) === -1);
      } else {
        result = Boolean(formValue.trim()) && formValue.indexOf(value as string) === -1;
      }
      break;
    case 'null':
      result = Array.isArray(formValue) ? formValue.length === 0 : formValue === undefined;
      break;
    case 'notNull':
      result = Array.isArray(formValue) ? formValue.length > 0 : formValue !== undefined;
      break;
    default:
      result = false;
      break;
  }
  return result;
}
// 解析图片、附件规则
function analysisFile(symbol: string, formValue: any): boolean {
  let result = false;
  const fileValue: ImageValue =
    typeof formValue === 'string' ? (JSON.parse(formValue) as ImageValue) : { ...formValue };
  const fileListLength = (fileValue.fileIdList?.length || 0) + (fileValue.fileList?.length || 0);
  if (symbol === 'null') {
    return fileListLength === 0;
  } else if (symbol === 'notNull') {
    return fileListLength > 0;
  }
  return result;
}
function analysisMember(symbol: string, formValue: number | number[]): boolean {
  let result = false;
  switch (symbol) {
    case 'null':
      result = Array.isArray(formValue) ? formValue.length === 0 : formValue === undefined;
      break;
    case 'notNull':
      result = Array.isArray(formValue) ? formValue.length > 0 : formValue !== undefined;
      break;
    default:
      result = false;
  }
  return result;
}
// 解析单个条件是否匹配
export function analysisRule(rule: fieldRule, formValues: { [k in string]: any }): boolean {
  const { fieldName, fieldType = '', symbol = '', value } = rule;
  const formValue = fieldName && formValues[fieldName];
  // 文本类型
  if (fieldType === 'Input' || fieldType === 'Textarea') {
    return analysisTextRule(symbol, value as string | string[], formValue as string);
  }
  // 数字类型
  if (fieldType === 'InputNumber') {
    return analysisNumberRule(symbol, value as number | [number, number], formValue as number);
  }
  // 日期类型
  if (fieldType === 'Date') {
    return analysisDateRule(symbol, value as number | [number, number] | string, formValue as number);
  }
  // 选项类型
  if (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'Checkbox') {
    return analysisOptionRule(symbol, value as string | string[], formValue as string);
  }
  // 图片或附件类型
  if (fieldType === 'Image' || fieldType === 'Attachment') {
    return analysisFile(symbol, formValue);
  }
  // 人员组件
  if (fieldType === 'Member') {
    return analysisMember(symbol, formValue as number | number[]);
  }
  // 其他类型
  if (symbol === 'null') {
    return formValue === undefined || formValue.trim() === '';
  }
  if (symbol === 'notNull') {
    return formValue !== undefined && formValue.trim() !== '';
  }
  return false;
}
// 解析单个条件块是否匹配
export function analysisRuleBlock(ruleBlock: fieldRule[], formValues: { [k in string]: any }): boolean {
  // 且条件,所有单个条件都符合才返回true
  return ruleBlock.every((rule) => analysisRule(rule, formValues));
}

// 解析表单值改变时规则
export function analysisFormChangeRule(fieldRuleList: fieldRule[][], formValues: { [k in string]: any }): boolean {
  // 或条件,只要有一个条件块符合即返回true
  return fieldRuleList.some((ruleBlock) => analysisRuleBlock(ruleBlock, formValues));
}

// 图片文件转base64
export function getBase64(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
type FileValue = {
  type: string;
  fileList: File[];
  fileIdList: { id: string; name: string }[];
};
// 批量上传文件
// TODO 这里不要用any, 看不懂values的结构
export async function uploadFile(values: any) {
  // 需要上传的文件,图片和附件合并到一起
  const imageFiles: { originFileObj: File }[] = [];
  const attachmentFiles: { originFileObj: File }[] = [];
  const fileIndexLocationRecord: { [key: string]: [number, number] } = {};
  const fileIdMap: { [k: string]: FileValue } = {};
  // 找出需要上传的文件,只有图片和附件需要上传
  Object.keys(values).forEach((key) => {
    const componentType = values[key] && values[key]?.type;

    if (componentType === 'Image' || componentType === 'Attachment') {
      const fileList = values[key].fileList.filter((file: { originFileObj: File }) => file.originFileObj);

      if (componentType === 'Image') {
        fileIndexLocationRecord[key] = [imageFiles.length, imageFiles.length + fileList.length];
        imageFiles.push(...fileList);
      } else if (componentType === 'Attachment') {
        fileIndexLocationRecord[key] = [attachmentFiles.length, attachmentFiles.length + fileList.length];
        attachmentFiles.push(...fileList);
      }
    }
  });

  const promiseList: Promise<any>[] = [];
  if (imageFiles.length > 0) {
    promiseList.push(batchUpload({ files: imageFiles.map((file) => file.originFileObj), type: 1 }));
  } else {
    promiseList.push(Promise.resolve());
  }
  if (attachmentFiles.length > 0) {
    promiseList.push(batchUpload({ files: attachmentFiles.map((file) => file.originFileObj), type: 2 }));
  } else {
    promiseList.push(Promise.resolve());
  }

  const [imageRes, attachmentRes] = await Promise.all(promiseList);

  Object.keys(fileIndexLocationRecord).forEach((key) => {
    const oldValue = values[key];
    let fileIdList;

    if (oldValue.type === 'Image') {
      fileIdList = (imageRes?.data || []).slice(...fileIndexLocationRecord[key]);
    } else if (oldValue.type === 'Attachment') {
      fileIdList = (attachmentRes?.data || []).slice(...fileIndexLocationRecord[key]);
    }

    fileIdMap[key] = {
      type: oldValue.type,
      fileList: [],
      fileIdList: (oldValue.fileIdList || []).concat(fileIdList),
    };
  });
  // 重新组装表单数据
  return Object.assign({}, values, fileIdMap);
}

export function exportFile(res: any, name: string, type?: string) {
  const blobConfig = type ? { type } : {};
  const blob = new Blob([res], blobConfig);
  const urlObject = window.URL || window.webkitURL || window;
  const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;

  save_link.href = urlObject.createObjectURL(blob);
  if (name) {
    save_link.download = name;
  }
  save_link.click();
}

export function downloadFile(id: string, name: string) {
  download(id).then((res) => {
    exportFile(res, name);
  });
}

export const loadFieldDatasource = async (config: SelectOptionItem): Promise<any[]> => {
  if (!config) {
    return Promise.resolve([]);
  }

  if (config.type === 'custom') {
    //自定义数据
    return Promise.resolve(config.data || []);
  } else if (config.type === 'subapp') {
    //其他表单数据
    const { fieldName = '', subappId = '' } = config;
    if (fieldName && subappId) {
      const dataRes = await runtimeAxios.get(`/subapp/${subappId}/form/${fieldName}/data`);

      return (dataRes.data?.data || []).map((val: string) => ({ key: val, value: val }));
    }

    return Promise.resolve([]);
  } else if (config.type === 'interface') {
    // 接口数据 构建端拿不到入参,不需要调用接口
    // const { apiconfig } = config;
    // if (apiconfig && formDataList) {
    //   const name = (apiconfig.response as { name: string })?.name;
    //   if (name) {
    //     const res = await runtimeAxios.post('/common/doHttpJson', { jsonObject: apiconfig, formDataList });
    //     let list: OptionItem[] = [];
    //     const data = eval(`res.${name}`);
    //     if (Array.isArray(data)) {
    //       if (data.every((val) => typeof val === 'string')) {
    //         // 字符串数组
    //         list = data.map((val) => ({ key: val, value: val }));
    //       } else if (data.every((val) => val.key && val.value)) {
    //         // key-value对象数组
    //         list = data.map((item) => ({ key: item.key, value: item.value }));
    //       }
    //     }
    //     return list;
    //   }
    //   return Promise.resolve([]);
    // }
  }

  return Promise.resolve([]);
};

// type ExtendProps = {
//   datasource: Datasource[keyof Datasource];
//   fieldName: string;
//   fieldsAuths: FieldAuthsMap;
//   projectId?: number;
//   readonly?: boolean;
// };
// export function compRender(type: AllComponentType['type'], Component: any, props: any, extendProps: ExtendProps) {
//   const { datasource, projectId, fieldName, fieldsAuths, readonly } = extendProps;
//   if ((type === 'Select' || type === 'Radio' || type === 'Checkbox') && datasource) {
//     return <Component {...props} options={datasource} />;
//   }
//   if (type === 'Member') {
//     return <Component {...props} projectid={projectId} />;
//   }
//   if (type === 'Tabs') {
//     return <Component {...props} fieldName={fieldName} auth={fieldsAuths} readonly={readonly} />;
//   }
//   return <Component {...props} />;
// }

export function getFieldValue(values: { key: 'createTime' | 'fieldName' | 'fixedChars'; fieldValue?: string }) {
  let tmp = {};
  if (values.key === 'createTime') {
    tmp = { format: DATE_DEFAULT_FORMAT };
  } else if (values.key === 'fieldName') {
    tmp = { fieldValue: values?.fieldValue };
  } else if (values.key === 'fixedChars') {
    tmp = { chars: '' };
  }
  return { ...tmp, type: values?.key };
}
