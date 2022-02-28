import { ReactNode, memo, useMemo, useRef } from "react";
import classnames from "classnames";
import moment from "moment";
import appConfig from "@/init";
import { timeDiff } from "@utils";
import { Icon, Text } from "@common/components";
import { NodeStatusType, FlowInstance } from "@type/detail";
import styles from "./index.module.scss";
import { useLocation } from "react-router-dom";

interface CellProps {
  title: string | ReactNode;
  icon?: string;
  desc: string | ReactNode;

  getContainer?(): HTMLElement;
}

const Cell = memo(function Cell(props: CellProps) {
  const { title, icon, desc, getContainer } = props;

  return (
    <div className={styles.cell}>
      {icon && <Icon className={styles["cell-icon"]} type={icon} />}
      <div className={styles["cell-content"]}>
        {getContainer ? (
          <Text className={styles["cell-title"]} getContainer={getContainer} placement="bottomLeft">
            {title}
          </Text>
        ) : (
          <div className={styles["cell-title"]}>{title}</div>
        )}

        <div className={styles["cell-desc"]}>{desc}</div>
      </div>
    </div>
  );
});

interface StatusBarProps {
  flowIns: FlowInstance;
  showCurrentProcessor?: boolean;
  className?: string;
}

function StatusBar(props: StatusBarProps) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { flowIns, showCurrentProcessor, className } = props;
  const status = flowIns.state;

  const theme = useMemo<string>(() => {
    // 以iframe方式接入,参数在location中
    if (location.search) {
      const params = new URLSearchParams(location.search.slice(1));
      return params.get("theme") || "light";
    }
    // 以微前端方式接入,参数在extra中
    if (appConfig?.extra?.theme) {
      return appConfig.extra.theme;
    }
    return "light";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, appConfig?.extra?.theme]);

  const { image, styleName } = useMemo(() => {
    let image = "";
    let styleName = "";
    const publicPath = appConfig.publicPath.replace(/\/$/, "");
    if (status === NodeStatusType.Processing) {
      image = `${publicPath}/images/flow-detail/${theme}-processing.png`;
      styleName = styles.processing;
    } else if (status === NodeStatusType.Undo) {
      image = `${publicPath}/images/flow-detail/${theme}-undo.png`;
      styleName = styles.undo;
    } else if (status === NodeStatusType.Terminated) {
      image = `${publicPath}/images/flow-detail/${theme}-terminated.png`;
      styleName = styles.terminated;
    } else if (status === NodeStatusType.Revert) {
      image = `${publicPath}/images/flow-detail/${theme}-revert.png`;
      styleName = styles.revert;
    } else if (status === NodeStatusType.Finish) {
      image = `${publicPath}/images/flow-detail/${theme}-finish.png`;
      styleName = styles.finish;
    } else if (status === NodeStatusType.Waiting) {
      image = `${publicPath}/images/flow-detail/${theme}-waiting.png`;
      styleName = styles.processing;
    }
    return { image, styleName };
  }, [status, theme]);

  const getContainer = useMemo(() => {
    return () => containerRef.current!;
  }, []);

  // 渲染statusbar内容
  const content = useMemo(() => {
    const trackNode = (
      <div className={styles.track}>
        <span>流程跟踪</span>
        <Icon type="jinru" />
      </div>
    );

    // 办结状态显示
    if (flowIns.state === NodeStatusType.Finish) {
      return (
        <div className={classnames(styles.status, styles.finish)}>
          <Cell title={timeDiff(flowIns.endTime - flowIns.applyTime)} desc="流程耗时" />

          <div>{trackNode}</div>
        </div>
      );
    }

    const trackCell = (
      <Cell
        title={<Text className={styles["time-used"]}>{`流程用时 ${timeDiff(Date.now() - flowIns.applyTime)}`}</Text>}
        desc={trackNode}
      />
    );

    if (flowIns.state === NodeStatusType.Waiting) {
      const currentNodesName = (flowIns.currentNodeList || []).map((item) => item.currentNodeName).join(",");

      return (
        <div className={styles.status}>
          <Cell icon="dangqianjiedian" title={currentNodesName} desc="当前节点" />
          {trackCell}
        </div>
      );
    }

    // 显示当前处理人
    if (showCurrentProcessor && flowIns.state !== NodeStatusType.Terminated) {
      const currentNodesName = (flowIns.currentNodeList || []).map((item) => item.currentNodeName).join(",");

      return (
        <div className={styles.status}>
          <Cell icon="dangqianjiedian" title={currentNodesName} desc="当前节点" />
          <Cell
            getContainer={getContainer}
            icon="dangqianchuliren"
            title={formatAllMembers(flowIns).join(",")}
            desc="当前处理人"
          />

          {trackCell}
        </div>
      );
    }

    return (
      <div className={styles.status}>
        <Cell icon="dangqianchuliren" title={flowIns.applyUser.name} desc="申请人" />
        <Cell
          icon="xuanzeshijian"
          title={moment(flowIns.applyTime).format("yyyy-MM-DD HH:mm:ss")}
          desc="申请时间"
          getContainer={getContainer}
        />

        {trackCell}
      </div>
    );
  }, [flowIns, showCurrentProcessor, getContainer]);

  return (
    <div className={classnames(styles.statusbar, styleName, className)} ref={containerRef}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt="状态图" />
        {content}
      </div>
    </div>
  );
}

export default memo(StatusBar);

function formatAllMembers(data: FlowInstance) {
  if (data.currentNodeList) {
    const list = data.currentNodeList || [];

    let userNames: string[] = [];
    let deptNames: string[] = [];
    let roleNames: string[] = [];

    list.forEach((item) => {
      const users = item?.currentProcessor?.users || [];
      const depts = item?.currentProcessor?.depts || [];
      const roles = item?.currentProcessor?.roles || [];

      userNames = userNames.concat(users.map((user) => user.name));
      deptNames = deptNames.concat(depts.map((dept) => dept.name));
      roleNames = roleNames.concat(roles.map((role) => role.name));
    });

    return deptNames.concat(roleNames).concat(userNames);
  }

  const currentMembers = data.currentProcessor || {};
  const users = (currentMembers.users || []).map((user) => user.name);
  const depts = (currentMembers.depts || []).map((dept) => dept.name);
  const roles = (currentMembers.roles || []).map((role) => role.name);

  return depts.concat(roles).concat(users);
}
