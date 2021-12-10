import React from "react";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import Header from "@components/header";
import Icon from "@assets/icon";
import "@containers/layout/home-header.style";

const HomeHeader: React.FC = () => {
  return (
    <div className="home_header">
      <Header>
        <nav className="nav_menu">
          <NavLink
            className={({ isActive }) =>
              classnames({ nav: true, active: isActive })
            }
            to="/"
          >
            <Icon className="icon" type="custom-icon-gongzuotai" />
            开始
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              classnames({ nav: true, active: isActive })
            }
            to="/asset-centre"
          >
            资产中心
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              classnames({ nav: true, active: isActive })
            }
            to="/app-manager"
          >
            应用管理
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              classnames({ nav: true, active: isActive })
            }
            to="/template-mall"
          >
            模板商城
          </NavLink>
        </nav>
      </Header>
    </div>
  );
};

export default HomeHeader;
