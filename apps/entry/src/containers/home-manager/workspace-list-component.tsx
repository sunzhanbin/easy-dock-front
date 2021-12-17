import { useState, useEffect, useCallback } from "react";
import { List, Avatar, Skeleton, Tooltip } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import Icon from "@assets/icon";
import "@containers/home-manager/index.style.scss";
import { useNavigate } from "react-router-dom";
import {
  useGetCanvasIdMutation,
  useGetHolosceneIdMutation,
  useGetRecentListMutation,
} from "@/http";
import { useAppSelector } from "@/store";
import { selectProjectId } from "@views/home/index.slice";
import { HomeSubAppType, ResponseType } from "@/consts";
import { ImageMap, NameMap } from "@utils/const";
import { JumpLinkToUrl } from "@utils/utils";

type ListItemType = {
  id: number;
  type: number;
  name: string;
  parentName: string;
  isApp: boolean;
};

const HomeWorkspaceList = () => {
  const navigate = useNavigate();
  const projectId = useAppSelector(selectProjectId);
  const [getRecentList] = useGetRecentListMutation();
  const [getHolosceneId] = useGetHolosceneIdMutation();
  const [getCanvasId] = useGetCanvasIdMutation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const loadMoreData = useCallback(() => {
    if (loading || !projectId) return;
    setLoading(true);
    (async () => {
      try {
        const ret: ResponseType = await getRecentList(projectId);
        setLoading(false);
        setData(ret.data);
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
      await JumpLinkToUrl(type, id, getCanvasId, getHolosceneId);
      if (isApp) {
        navigate(`/app-manager/${id}`);
      } else if (type === HomeSubAppType.DEVICE) {
        // todo
        window.open(`http://10.19.248.238:9003/#/scene/${id}`);
      } else if (type === HomeSubAppType.INTERFACE) {
        window.open(`http://10.19.248.238:28217/orch`);
      } else if (type === HomeSubAppType.DATA_FISH) {
        // todo
        window.open(`http://10.19.248.238:9003/#/scene/${id}`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadMoreData();
  }, [projectId]);

  return (
    <div className="bottom_sider">
      <div className="workspace_info">
        <p className="text_recent_app">最近更新</p>
        <p className="operation_all" onClick={toAppManage}>
          <span className="text">全部</span>
          <Icon className="icon" type="custom-icon-jinrujiantou" />
        </p>
      </div>
      <div className="workspace_list" id="scrollableDiv">
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
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
                  avatar={<Avatar src={ImageMap[item.type]} />}
                  title={
                    <Tooltip title={item.name}>
                      <a className="name">{item.name}</a>
                    </Tooltip>
                  }
                  description={
                    <Tooltip
                      title={`${item.isApp ? "应用" : NameMap[item.type]}｜${
                        item.parentName
                      }`}
                    >
                      <span>{`${item.isApp ? "应用" : NameMap[item.type]}｜${
                        item.parentName
                      }`}</span>
                    </Tooltip>
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomeWorkspaceList;
