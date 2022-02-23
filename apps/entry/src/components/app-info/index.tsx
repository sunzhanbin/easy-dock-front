import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { useWorkspaceRuntimeDetailQuery } from "@/http";
import { useAppSelector } from "@/store";
import { selectBasicForm } from "@/views/app-setup/basic-setup.slice";
import { imgIdToUrl } from "@/utils/utils";
import lightDefaultLogo from "@assets/images/light-default-logo.png";
import darkDefaultLogo from "@assets/images/dark-default-logo.png";
import { NavModeType, ThemeType } from "@/consts";
import { Text } from "@common/components";
import "@components/app-info/index.style";

const AppInfo = ({
  navMode,
  theme,
  mode = "builder",
}: {
  navMode: NavModeType;
  theme: ThemeType;
  mode?: "builder" | "runtime";
}) => {
  const appBasicConfig = useAppSelector(selectBasicForm);
  const { workspaceId } = useParams();
  const { icon, workspaceName } = useWorkspaceRuntimeDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      icon: data?.extension?.icon || "",
      workspaceName: data?.extension?.name || "",
    }),
    skip: mode === "builder",
  });
  const appName = useMemo(() => {
    if (mode === "builder") {
      return appBasicConfig?.name || "未命名站点";
    }
    return workspaceName;
  }, [mode, workspaceName, appBasicConfig?.name]);
  const logoId = useMemo(() => {
    if (mode === "builder") {
      return appBasicConfig?.icon;
    }
    return icon;
  }, [mode, icon, appBasicConfig?.icon]);
  const classNameMap = useMemo<{ [k in NavModeType]: string }>(() => {
    return {
      [NavModeType.LEFT]: "single",
      [NavModeType.MULTI]: "multi",
      [NavModeType.TOP]: "top",
    };
  }, []);
  const navModeClassName = useMemo<string>(() => classNameMap[navMode], [navMode, classNameMap]);

  const [logoUrl, setLogoUrl] = useState<string>("");

  const content = useMemo(() => {
    let src = "";
    if (logoUrl) {
      src = logoUrl;
    } else {
      src = theme === ThemeType.DARK ? darkDefaultLogo : lightDefaultLogo;
    }
    return (
      <div className={navModeClassName}>
        <img className="app-logo" src={src} alt="logo" />
        <div className="app-name">
          <Text text={appName} />
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navMode, appName, logoUrl, theme]);

  useEffect(() => {
    (async () => {
      if (logoId) {
        const url = await imgIdToUrl(logoId);
        setLogoUrl(url);
      } else {
        setLogoUrl("");
      }
    })();
  }, [logoId]);
  return <div className={classNames("app-info", theme)}>{content}</div>;
};

export default AppInfo;
