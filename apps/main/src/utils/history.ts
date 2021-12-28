import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: '/main/',
  getUserConfirmation(a, b) {
    console.log(a, b);
  },
});

export default history;

export enum SerialNumType {
  incNumber = '自动计数',
  createTime = '提交日期',
  fixedChars = '固定字符',
  fieldName = '表单字段',
}

const a = SerialNumType['incNumber']
console.log(a, 'aaa')