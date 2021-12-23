import React, { useCallback, useRef } from "react";
import MenuSetupListComponent from "@containers/app-setup-config/menu-setup-list.component";
import MenuSetupFormComponent from "@containers/app-setup-config/menu-setup-form.component";

import "@containers/app-setup-config/menu-setup.style";

type MenuSetupFormComponentHandle = React.ElementRef<
  typeof MenuSetupFormComponent
>;

const MenuSetupComponent = () => {
  const formRef = useRef<MenuSetupFormComponentHandle>(null);

  // 切换菜单前执行执行钩子；
  const handleBeforeIdChange = useCallback(() => {
    return new Promise((resolve, reject) => {
      /* 以下仅作为参考示例 */
      // 切换前规则校验；
      if (formRef.current) {
        formRef.current
          ?.validateFields()
          .then((values: any) => {
            resolve(values);
          })
          .catch(() => reject);
      }
    });
  }, [formRef.current]);

  return (
    <div className="menu-setup-component">
      <MenuSetupListComponent onBeforeIdChange={handleBeforeIdChange} />
      <MenuSetupFormComponent ref={formRef} />
    </div>
  );
};

export default MenuSetupComponent;
