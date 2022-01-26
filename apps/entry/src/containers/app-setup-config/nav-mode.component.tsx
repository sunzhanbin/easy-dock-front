import { memo, FC, useMemo } from "react";
import classNames from "classnames";
import useMemoCallback from "@common/hooks/use-memo-callback";
import LeftNav from "@assets/images/left-nav.png";
import BothNav from "@assets/images/both-nav.png";
import TopNav from "@assets/images/top-nav.png";
import { useAppDispatch } from "@/store";
import { setMode } from "@/views/app-setup/basic-setup.slice";
import "./nav-mode.style.scss";
import { NavModeType } from "@/consts";

interface NavModeProps {
  value?: NavModeType;
  onChange?: (value: this["value"]) => void;
}

interface ModeItem {
  key: NavModeType;
  label: string;
  image: string;
}

const NavMode: FC<NavModeProps> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const modeList = useMemo<ModeItem[]>(() => {
    return [
      { key: NavModeType.LEFT, label: "左导航", image: LeftNav },
      { key: NavModeType.MULTI, label: "双导航", image: BothNav },
      { key: NavModeType.TOP, label: "顶部导航", image: TopNav },
    ];
  }, []);
  const handleChangeNav = useMemoCallback((nav: NavModeType) => {
    dispatch(setMode(nav));
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
            <img src={image} alt="picture" className="image" />
          </div>
          <div className="text">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default memo(NavMode);
