import { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "@/store";
import { selectBasicForm } from "@/views/app-setup/basic-setup.slice";
import { imgIdToUrl } from "@/utils/utils";
import lightDefaultLogo from "@assets/images/light-default-logo.png";
import darkDefaultLogo from "@assets/images/dark-default-logo.png";
import { NavModeType, ThemeType } from "@/consts";
import { Text } from "@common/components";
import "@components/app-info/index.style";

export const SingleNavAppInfo = () => {
  return <div className="single-nav-app-info">这里是单导航时UI</div>;
};

export const MultiNavAppInfo = () => {
  return <div className="multi-nav-app-info">这里是双导航时UI</div>;
};

const AppInfo = ({
  navMode,
  theme,
}: {
  navMode: NavModeType;
  theme: ThemeType;
}) => {
  const appBasicConfig = useAppSelector(selectBasicForm);
  const appName = useMemo(() => appBasicConfig?.name || "未命名站点", [
    appBasicConfig?.name,
  ]);
  const classNameMap = useMemo<{ [k in NavModeType]: string }>(() => {
    return {
      [NavModeType.LEFT]: "single",
      [NavModeType.MULTI]: "multi",
    };
  }, []);
  const navModeClassName = useMemo<string>(() => classNameMap[navMode], [
    navMode,
  ]);

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
  }, [navMode, appName, logoUrl, theme]);

  useEffect(() => {
    (async () => {
      const logoId = appBasicConfig?.icon || "";
      if (logoId) {
        const url = await imgIdToUrl(logoId);
        setLogoUrl(url);
      } else {
        setLogoUrl("");
      }
    })();
  }, [appBasicConfig?.icon]);
  return <div className="app-info">{content}</div>;
};

export default AppInfo;
