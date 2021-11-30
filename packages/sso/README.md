# `sso`

-   单点登录 js 库

## Usage

[API 文档](https://confluence.enncloud.cn/pages/viewpage.action?pageId=708182467)

### script 标签方式：

```html
<script src="%PUBLIC_URL%/sso.js"></script>
```

```javascript
// script tag 方式加载 sso.js
if (!window.Auth) {
    console.error('SSO login 加载失败.');
    return;
}
// window.SSO_LOGIN_URL 有值则可以省略 setLoginServer
// window.Auth.setLoginServer('http://aaa/login'); 或者：
window.Auth.setConfig({ server: 'http://aaa/login' });
const token = await window.Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
```

### import 方式：

```javascript
// import 方式加载 sso.js
import Auth from '../dist/index.esm';

Auth.setConfig({ server: 'http://aaa/login' });
const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
```

### require 方式：

```javascript
// require 方式加载 sso.js
const Auth = require('../dist/index.cjs.min');

Auth.setConfig({ server: 'http://aaa/login' });
const token = await Auth.getToken(true, window.EASY_DOCK_BASE_SERVICE_ENDPOINT);
```

-   若该工程发布至 npm 服务器，则可以使用 npm 包名引入

```javascript
// import 方式加载 sso.js，自动匹配入口 '../dist/index.esm'
import Auth from '@enc/sso';

// require 方式加载 sso.js，自动匹配入口 '../dist/index.cjs.min'
const Auth = require('@enc/sso');
```
