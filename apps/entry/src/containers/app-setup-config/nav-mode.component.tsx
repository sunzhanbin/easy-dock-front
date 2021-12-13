import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import LeftNav from "@assets/images/left-nav.png";
import BothNav from "@assets/images/both-nav.png";
import "./nav-mode.style.scss";

interface NavModeProps {
  value?: string;
  onChange?: (value: this["value"]) => void;
}

interface ModeItem {
  key: string;
  label: string;
  image: string;
}

const NavMode: FC<NavModeProps> = ({ value, onChange }) => {
  const modeList = useMemo<ModeItem[]>(() => {
    return [
      { key: "multi", label: "双导航", image: BothNav },
      { key: "single", label: "左导航", image: LeftNav },
    ];
  }, []);
  const handleChangeNav = useMemoCallback((nav: string) => {
    onChange && onChange(nav);
  });
  return (
    <div className="nav-mode-container">
      {modeList.map(({ key, label, image }) => (
        <div
          key={key}
          className={classNames("nav-mode-item", key === value && "active")}
          onClick={() => handleChangeNav(key)}
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

export default memo(NavMode);
