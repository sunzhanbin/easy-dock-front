# 动态主题

## 文档说明

* dist/utils.esm.js：工具类方法；
    * `export function registerTheme(theme: {[key: string]: string})`： 同时更改 ant & custum；
      ```css
      theme {
        '--ant-primary-color': '#fff',
        '--custom-primary-color': '#fff',
      }
      ```
    * `export function registerCustomTheme(theme: {[key: string]: string})`： custom；
    * `export function registerAntTheme(theme: {[key: string]: string}) `：ant

* dist/variable.css: 自定义变量文件；

* dist/react/antd & dist/vue/iview：组件库样式文件；

## 使用说明

1. main.js 中添加文件
```JavaScript
import 'antd/dist/antd.variable.min.css';

// ***

import {registerTheme} from './theme/utils';

registerTheme({
  "--ant-primary-color": theme || cookie.get('ant') || '#4c5cdb',
  "--custom-primary-color": theme || cookie.get('custom') || '#4c5cdb',
})

```