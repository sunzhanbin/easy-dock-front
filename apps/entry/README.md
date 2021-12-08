components: 具有完备功能的组件；

containers：高阶组件；

views：页面；

**注意事项：**

* RTK 中使用 immer 库，避免对复杂类型的直接赋值，赋值前保证需要转换成全新的对象（深度克隆等方法）；
* 文件资源路径使用绝对路径，方便重构；

    ```JavaScript
    /* 文件路径： D:\project\easy-dock-front\apps\entry\src\containers\workspace-running\index.tsx */
    import { Routes, Route } from "react-router-dom";
    import NavComponent from "@containers/workspace-running/nav.component";
    import ContentComponent from "@containers/workspace-running/content.component";
    import "@containers/workspace-running/index.style";
    ```
