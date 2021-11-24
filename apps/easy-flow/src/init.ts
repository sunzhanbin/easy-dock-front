const appConfig = {
  micro: false,
  basename: '/',
  publicPath: process.env.PUBLIC_URL,
  appId: '',
};
console.log(`__webpack_public_path__: default`);
// 微前端里的配置
if (window.__POWERED_BY_QIANKUN__) {
  appConfig.micro = true;
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + 'easyflow/'; // 替换webpack的ouput.publicPath
  console.log(`__webpack_public_path__: ${__webpack_public_path__}`);
  // eslint-disable-next-line no-undef
  appConfig.publicPath = __webpack_public_path__; // 加载public文件夹里的资源使用
}

export default appConfig;
