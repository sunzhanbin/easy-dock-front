import "@containers/home-manager/help.style.scss";
import { List, Tooltip } from "antd";
import Icon from "@assets/icon";
import { HELP_LIST } from "@utils/const";

const HeaderHelp = () => {
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
        dataSource={HELP_LIST}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={<a className="name">{item.name}</a>}
              description={
                <Tooltip title={item.desc} className="desc">
                  {item.desc}
                </Tooltip>
              }
            />
            <Icon className="icon icon-detail" type="custom-icon-jinru" />
          </List.Item>
        )}
      />
    </div>
  );
};

export default HeaderHelp;
