// 构建端主题色
import { useMemo, useEffect } from "react";
import cookie from "js-cookie";
import { registerTheme } from "@theme/src/utils";

export default function useBuildTheme() {
  const location = window.location;

  const theme = useMemo<string>(() => {
    if (location?.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    return cookie.get("theme") || "light";
  }, [location.search]);

  useEffect(() => {
    cookie.set("theme", theme);
    registerTheme({
      theme,
    });
  }, [theme]);
}
