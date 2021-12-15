import { useMemo, useState, useEffect } from "react";
import { useAppSelector } from "@/store";
import { selectBasicForm } from "@/views/app-setup/basic-setup.slice";
import { imgIdToUrl } from "@/utils/utils";
import defaultLogo from "@assets/images/default-logo.png";
import { NavModeType } from "@/consts";
import { Text } from "@common/components";
import "@components/app-info/index.style";

export const SingleNavAppInfo = () => {
  return <div className="single-nav-app-info">这里是单导航时UI</div>;
};

export const MultiNavAppInfo = () => {
  return <div className="multi-nav-app-info">这里是双导航时UI</div>;
};

const AppInfo = ({ navMode }: { navMode: NavModeType }) => {
  const appBasicConfig = useAppSelector(selectBasicForm);
  const appName = useMemo(() => appBasicConfig?.name || "未命名站点", [
    appBasicConfig?.name,
  ]);

  const [logoUrl, setLogoUrl] = useState<string>("");

  const content = useMemo(() => {
    if (navMode === NavModeType.SINGLE) {
      return <div></div>;
    }
    if (navMode === NavModeType.MULTI) {
      return (
        <div className="multi">
          <img
            className="app-logo"
            src={logoUrl ? logoUrl : defaultLogo}
            alt="logo"
          />
          <div className="app-name">
            <Text text={appName} />
          </div>
        </div>
      );
    }
    return null;
  }, [navMode, appName, logoUrl]);

  useEffect(() => {
    (async () => {
      const logoId = appBasicConfig?.icon?.id || "";
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
