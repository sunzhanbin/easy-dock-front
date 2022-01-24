import { memo, FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWorkspaceDetailQuery } from "@/http/app-manager.hooks";
import lightEmptyImage from "@assets/images/light-empty.png";
import darkEmptyImage from "@assets/images/dark-empty.png";
import { ThemeType } from "@/consts";
import "./empty-page.style.scss";

const EmptyPage: FC = () => {
  const { workspaceId } = useParams();
  const { theme } = useWorkspaceDetailQuery(Number(workspaceId), {
    selectFromResult: ({ data }) => ({
      theme: data?.extension?.theme || "light",
    }),
    skip: !workspaceId,
  });
  const themeImageMap = useMemo<{ [k in ThemeType]: string }>(() => {
    return {
      [ThemeType.DARK]: darkEmptyImage,
      [ThemeType.LIGHT]: lightEmptyImage,
      [ThemeType.ORANGE]: lightEmptyImage,
      [ThemeType.BLUE]: lightEmptyImage,
    };
  }, []);
  const imageUrl = useMemo<string>(() => {
    return themeImageMap[theme as ThemeType] || lightEmptyImage;
  }, [theme, themeImageMap]);
  return (
    <div className="empty-page">
      <div className="empty-container">
        <img src={imageUrl} alt="empty" className="image" />
        <div className="text">菜单暂无内容</div>
        <div className="tip">请前往编辑端编辑菜单内容~</div>
      </div>
    </div>
  );
};

export default memo(EmptyPage);
