import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import lightTheme from "@assets/images/light-theme.png";
import darkTheme from "@assets/images/dark-theme.png";
import "./theme.style.scss";

interface ThemeProps {
  value?: string;
  onChange?: (value: this["value"]) => void;
}

interface ThemeItem {
  key: string;
  label: string;
  image: string;
}

const Theme: FC<ThemeProps> = ({ value, onChange }) => {
  const modeList = useMemo<ThemeItem[]>(() => {
    return [
      { key: "light", label: "浅色", image: lightTheme },
      { key: "dark", label: "深色", image: darkTheme },
    ];
  }, []);
  const handleChangeTheme = useMemoCallback((nav: string) => {
    onChange && onChange(nav);
  });
  return (
    <div className="theme-container">
      {modeList.map(({ key, label, image }) => (
        <div
          key={key}
          className={classNames("theme-item", key === value && "active")}
          onClick={() => handleChangeTheme(key)}
        >
          <div className="image-container">
            <img src={image} alt="image" className="image" />
          </div>
          <div className="text">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default memo(Theme);
