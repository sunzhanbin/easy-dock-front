import { useState, useEffect, useCallback } from "react";
import { List, Avatar, Tooltip } from "antd";
import { Icon, Loading, Text } from "@common/components";
import "@containers/home-manager/index.style.scss";
import { useNavigate } from "react-router-dom";
import { imgIdToUrl } from "@/utils/utils";
import {
  useGetCanvasIdMutation,
  useGetHoloSceneIdMutation,
  useGetRecentListMutation,
} from "@/http";
import { useAppSelector } from "@/store";
import { selectProjectId } from "@views/home/index.slice";
import { ResponseType } from "@/consts";
import { ImageMap, NameMap } from "@utils/const";
import { JumpLinkToUrl } from "@utils/utils";
import NoImage from "@assets/images/home/no-app.png";

type ListItemType = {
  id: number;
  type: number;
  name: string;
  parentName: string;
  isApp: boolean;
  icon: string;
};

const HomeWorkspaceList = () => {
  const navigate = useNavigate();
  const projectId = useAppSelector(selectProjectId);
  const [getRecentList] = useGetRecentListMutation();
  const [getHoloSceneId] = useGetHoloSceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const loadMoreData = useCallback(() => {
    if (loading || !projectId) return;
    setLoading(true);
    (async () => {
      try {
        const ret: ResponseType = await getRecentList({
          id: projectId,
          size: 14,
        });
        setLoading(false);
        const list = ret.data.map(async (item: ListItemType) => ({
          ...item,
          icon: item.isApp && item.icon ? await imgIdToUrl(item.icon) : null,
        }));
        const finalList = await Promise.all(list);
        setData(finalList);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    })();
  }, [data, projectId]);
  const toAppManage = useCallback(() => {
    navigate("/app-manager");
  }, [navigate]);
  const handleLinkTo = useCallback(
    async (item: ListItemType) => {
      const { isApp, type, id } = item;
      await JumpLinkToUrl(type, id, getCanvasId, getHoloSceneId);
      if (isApp) {
        navigate(`/app-manager/${id}`);
      }
    },
    [navigate]
  );
  const renderIcon = (item: ListItemType): string => {
    if (item.isApp) {
      return item.icon ? item.icon : NoImage;
    }
    return ImageMap[item.type];
  };

  const renderName = (item: ListItemType) => {
    return `${item.isApp ? "应用" : NameMap[item.type]}｜${item.parentName}`;
  };

  useEffect(() => {
    loadMoreData();
  }, [projectId]);

  return (
    <div className="bottom_sider">
      <div className="workspace_info">
        <p className="text_recent_app">最近更新</p>
        <p className="operation_all" onClick={toAppManage}>
          <span className="text">全部</span>
          <Icon className="icon" type="jinrujiantou" />
        </p>
      </div>
      <div className="workspace_list">
        {loading ? (
          <Loading />
        ) : (
          <List
            className="list"
            grid={{
              gutter: 16,
              column: 2,
            }}
            dataSource={data}
            renderItem={(item: ListItemType) => (
              <List.Item key={item.id} onClick={() => handleLinkTo(item)}>
                <List.Item.Meta
                  avatar={<Avatar src={renderIcon(item)} alt={""} />}
                  title={
                    <Tooltip title={item.name}>
                      <Text>{item.name}</Text>
                    </Tooltip>
                  }
                  description={
                    <Tooltip title={renderName(item)}>
                      <Text>{renderName(item)}</Text>
                    </Tooltip>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default HomeWorkspaceList;
