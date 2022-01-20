import React, { memo } from "react";
import { NavLink, useMatch } from "react-router-dom";
import { Icon } from "@common/components";
import classNames from "classnames";
import ProjectAuth from "@views/auth/project-auth";
import "@views/auth/index.style.scss";

const UserManager = () => {
  const matched = useMatch("/user-auth");

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="menus">
          <NavLink to={matched?.pathname!} className={({ isActive }) => classNames({ nav: true, active: isActive })}>
            <Icon type="quanxianshezhi" className="icon" />
            <div className="text">权限设置</div>
          </NavLink>
        </div>
      </div>
      <div className="content">
        <ProjectAuth />
      </div>
    </div>
  );
};

export default memo(UserManager);
