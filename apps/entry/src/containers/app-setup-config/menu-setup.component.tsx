import MenuSetupListComponent from "@containers/app-setup-config/menu-setup-list.component";
import MenuSetupFormComponent from "@containers/app-setup-config/menu-setup-form.component";

import "@containers/app-setup-config/menu-setup.style";

const MenuSetupComponent = () => {
  return (
    <div className="menu-setup-component">
      <MenuSetupListComponent />
      <MenuSetupFormComponent />
    </div>
  );
};

export default MenuSetupComponent;
