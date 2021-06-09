import { memo, useMemo, FC } from 'react';
import styled from 'styled-components';
import FlowImage from '@assets/flow-app.png';
import ScreenImage from '@assets/screen-app.png';
import { getShorterText } from '@/utils';
import { Icon } from '@/components';

const Container = styled.div`
  position: relative;
  display: flex;
  .image {
    flex: 0 0 74px;
  }
  .content {
    flex: 1;
    padding: 16px;
    background: rgba(24, 39, 67, 0.03);
    border-radius: 0 3px 3px 0;
    .header {
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #181f43;
        line-height: 22px;
      }
      .operation {
        width: 20px;
        height: 20px;
        cursor: pointer;
        .more {
          display: block;
          width: 20px;
          height: 20px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 19px;
      .status {
        width: 48px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 400;
        color: #03a882;
        background: rgba(6, 196, 152, 0.12);
      }
      .type {
        font-size: 12px;
        font-weight: 400;
        color: rgba(24, 31, 67, 0.5);
        line-height: 20px;
      }
    }
  }
`;

const Card: FC<{ name: string; status: number; type: 1 | 2; className?: string }> = ({
  name,
  status,
  type,
  className,
}) => {
  const statusText = useMemo(() => {
    const statusMap: { [K: string]: string } = {
      '-1': '已停用',
      '1': '已启用',
    };
    return statusMap[status];
  }, [status]);
  return (
    <Container className={className}>
      <div className="image" style={{ backgroundColor: type === 1 ? '#DFF5EF' : '#E7EBFD' }}>
        <img src={type === 1 ? ScreenImage : FlowImage} alt="图片" />
      </div>
      <div className="content">
        <div className="header">
          <div className="name">{getShorterText(name)}</div>
          <div className="operation">
            <Icon type="gengduo" className="more" />
          </div>
        </div>
        <div className="footer">
          <div className="status">{statusText}</div>
          <div className="type">{type === 1 ? '大屏' : '流程'}</div>
        </div>
      </div>
    </Container>
  );
};

export default memo(Card);
