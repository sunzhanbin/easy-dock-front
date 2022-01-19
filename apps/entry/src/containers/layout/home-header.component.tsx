import React from "react";
import classnames from "classnames";
import { NavLink, useLocation } from "react-router-dom";
import Header from "@components/header";
import { useAppSelector } from "@/store";
import { selectProjectId } from "@/views/home/index.slice";
import "@containers/layout/home-header.style";
import { useFetchWorkspaceListQuery } from "@/http/app-manager.hooks";

const HomeHeader: React.FC = () => {
  const projectId = useAppSelector(selectProjectId);
  const { workspaceId } = useFetchWorkspaceListQuery(projectId, {
    selectFromResult: (data) => {
      return {
        workspaceId: data?.data?.[0].id || "",
      };
    },
    skip: !projectId,
  });
  const location = useLocation();
  const mainEntry = location.pathname === "/";
  return (
    <div className={classnames("home_header", mainEntry ? "main-header" : "")}>
      <Header>
        <nav className="nav_menu">
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/home">
            工作台
          </NavLink>
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/asset-centre">
            资产中心
          </NavLink>
          <NavLink
            className={() => classnames({ nav: true, active: location.pathname.startsWith("/app-manager") })}
            to={`/app-manager/project/${projectId}/workspace/${workspaceId}`}
          >
            应用管理
          </NavLink>
          <NavLink className={({ isActive }) => classnames({ nav: true, active: isActive })} to="/template-mall">
            模板商城
          </NavLink>
        </nav>
      </Header>
    </div>
  );
};

export default HomeHeader;
