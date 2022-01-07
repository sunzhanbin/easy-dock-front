import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import { ThemeType } from "@/consts";
import { useAppDispatch } from "@/store";
import { setTheme } from "@/views/app-setup/basic-setup.slice";
import useMemoCallback from "@common/hooks/use-memo-callback";
import lightTheme from "@assets/images/light-theme.png";
import darkTheme from "@assets/images/dark-theme.png";
import orangeTheme from "@assets/images/orange-theme.png";
import blueTheme from "@assets/images/blue-theme.png";
import "./theme.style.scss";

interface ThemeProps {
  value?: string;
  onChange?: (value: this["value"]) => void;
}

interface ThemeItem {
  key: ThemeType;
  label: string;
  image: string;
}

const Theme: FC<ThemeProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const modeList = useMemo<ThemeItem[]>(() => {
    return [
      { key: ThemeType.LIGHT, label: "浅色", image: lightTheme },
      { key: ThemeType.DARK, label: "深色", image: darkTheme },
      { key: ThemeType.ORANGE, label: "活力橙", image: orangeTheme },
      { key: ThemeType.BLUE, label: "商务蓝", image: blueTheme },
    ];
  }, []);
  const handleChangeTheme = useMemoCallback((theme) => {
    dispatch(setTheme(theme));
    onChange && onChange(theme);
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
