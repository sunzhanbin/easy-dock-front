## 开发指南

本项目采用多软件包仓库（monorepo），使用`lerna`管理项目，可实现单个仓库中管理、配置多个软件包，可进行统一构建和测试流程，以及提供跨项目复用代码的解决方案，通用的部分可放在`packages`目录下，具体业务相关放在`main`目录下, 如有项目级别的业务新增可与`main`同级存放，同时在`lerna.json`和`package.json`新增该目录。[lerna 文档](https://chinabigpan.github.io/lerna-docs-zh-cn/routes/basic/about.html)。

### 项目初始化

本项目是使用`yarn`做为`npm-client`, 所以需要先安装`yarn`:

```
npm install yarn -g
```

全局安装`lerna`:

```
yarn global add lerna@3.22.1
```

安装项目包:

```
yarn bootstrap
```

启动项目:

```
yarn start
```

### 开发过程中新增 npm 包

- 根目录私有包(如代码检查、提交工具、自动化工具等)

  ```sh
  yarn add <package name> -W [-D]
  ```

- 项目公共包(如 react 等)

  ```sh
  lerna add <packageName> [-D] [-S]
  ```

  上述命令会把该包做为依赖写入所有 package 里的`package.json`。

- 某些项目私有包(如: react-router-dom 在 A 包中用 B 包中不用)

  ```
  lerna add react-router-dom --scope A
  ```

  上述命令只会把包做为依赖写入 A 包里的`package.json`。

### 给 npm-client 传递参数

可以通过 `--` 后添加选项, 设置 npm cient 的参数。.

### 开发过程中 Windows 端口被占用解决办法

- 查看指定端口的占用情况

  ```sh
  netstat -aon|findstr "8082"
  ```

- 直接强制杀死指定端口(假设端口被进程号为 4136 的进程占用)

  ```sh
  taskkill /pid 4136 /t /f
  ```
