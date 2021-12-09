import MenuSetupListComponent from "./menu-setup-list.component";
import MenuSetupFormComponent from "./menu-setup-form.component";

import "./menu-setup.style";

const MenuSetupComponent = () => {
  return (
    <div className="menu-setup-component">
      <MenuSetupListComponent />
      <MenuSetupFormComponent />
    </div>
  );
};

export default MenuSetupComponent;
