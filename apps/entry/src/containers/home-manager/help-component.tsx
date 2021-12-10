import "@containers/home-manager/help.style.scss";
import { useEffect, useState } from "react";
import { List } from "antd";
import Icon from "@assets/icon";

const HeaderHelp = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    setData([
      {
        id: 1,
        name: "平台说明",
        desc: "79834729471947",
      },
    ]);
  }, []);
  return (
    <div className="header_help">
      <List
        className="list"
        grid={{
          gutter: 16,
          column: 4,
        }}
        header={
          <div className="help_header">
            <span className="text_recent_app">帮助文档</span>
            <p className="operation_all">
              <span className="text">全部</span>
              <Icon className="icon" type="custom-icon-jinrujiantou" />
            </p>
          </div>
        }
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={<a className="name">{item.name}</a>}
              description={item.desc}
            />
            <Icon className="icon" type="custom-icon-jinru" />
          </List.Item>
        )}
      />
    </div>
  );
};

export default HeaderHelp;
