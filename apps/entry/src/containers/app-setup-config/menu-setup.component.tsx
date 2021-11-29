import MenuSetupListComponent from "./menu-setup-list.component";
import MenuSetupFormComponent from "./menu-setup-form.component";

const MenuFormComponent = () => {
  return (
    <div className="menu-form-component">
      <MenuSetupListComponent />
      <MenuSetupFormComponent />
    </div>
  );
};

export default MenuFormComponent;
