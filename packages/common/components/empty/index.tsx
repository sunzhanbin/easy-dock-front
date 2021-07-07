import emptyImage from '../../../../apps/main/src/assets/empty_normal.png';

export default function Empty() {
  return (
    <div className="ant-empty ant-empty-normal">
      <div className="ant-empty-image">
        <img src={emptyImage} alt="empty" />
        <div className="ant-empty-description">暂无数据</div>
      </div>
    </div>
  );
}
