import { useState, useEffect } from "react";
import { List, message, Avatar, Skeleton, Divider } from "antd";
// import InfiniteScroll from "react-infinite-scroll-component";
import Icon from "@assets/icon";
import "@containers/home-manager/index.style.scss";

const HomeWorkspaceList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div className="bottom_sider">
      <div className="workspace_info">
        <p className="text_recent_app">最近应用</p>
        <p className="operation_all">
          <span className="text">全部</span>
          <Icon className="icon" type="custom-icon-jinrujiantou" />
        </p>
      </div>
      <div>
        {/*<InfiniteScroll*/}
        {/*  dataLength={data.length}*/}
        {/*  next={loadMoreData}*/}
        {/*  hasMore={data.length < 50}*/}
        {/*  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}*/}
        {/*  endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}*/}
        {/*  scrollableTarget="scrollableDiv"*/}
        {/*>*/}
        <List
          grid={{
            gutter: 16,
            column: 2,
          }}
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description="12"
              />
              <div>Content</div>
            </List.Item>
          )}
        />
        {/*</InfiniteScroll>*/}
      </div>
    </div>
  );
};

export default HomeWorkspaceList;
