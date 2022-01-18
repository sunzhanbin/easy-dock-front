import { memo, FC } from "react";
import codingImage from "@assets/images/coding.png";
import "./index.style.scss";

const Coding: FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="coding-container">
      <div className="image-container">
        <img src={codingImage} alt="image" className="image" />
        <div className="title">{title}</div>
        <div className="coding">正在开发中…</div>
      </div>
    </div>
  );
};

export default memo(Coding);
