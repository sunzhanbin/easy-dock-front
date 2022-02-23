components: 具有完备功能的组件；

containers：高阶组件；

views：页面；

**注意事项：**

* RTK 中使用 immer 库，避免对复杂类型的直接赋值，赋值前保证需要转换成全新的对象（深度克隆等方法）；
* 文件资源路径使用绝对路径，方便重构；

    ```JavaScript
    /* 文件路径： D:\project\easy-dock-front\apps\entry\src\containers\workspace-running\main.tsx */
    import { Routes, Route } from "react-router-dom";
    import NavComponent from "@containers/workspace-running/nav.component";
    import ContentComponent from "@containers/workspace-running/content.component";
    import "@containers/workspace-running/index.style";
    ```

### **命名规则规范**

> * camel case （驼峰式）：calmelCase | CamelCase 
> * snake case （蛇式）：snake_case
> * kebab case （烤肉串式）：kebab-case



#### **样式命名规则： kebab case**


```css
.app-manager-component {
    background: #fff;
}
```

#### **container 文件下组件文件命名规则**

* ***样式文件***： example-demo-XXX.style.scss
* ***tsx 文件***：example-demo-XXX.component.tsx

#### **组件最外层类名与组件名称保持一致**

* 
    ```css
    /* example-demo-xxx.component.tsx 文件 */

    .example-demo-xxx-component {
        background: #fff;
    }
    ```
* **`暂时没有没有使用css module`**，命名勿随意
