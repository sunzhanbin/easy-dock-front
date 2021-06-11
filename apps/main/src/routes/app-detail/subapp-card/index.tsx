import { memo, useMemo, useState, FC } from 'react';
import styled from 'styled-components';
import FlowImage from '@assets/flow-big.png';
import ScreenImage from '@assets/screen-big.png';
import { getShorterText } from '@/utils';
import { Icon } from '@/components';
import classNames from 'classnames';

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
    &:hover {
      .header {
        .icon_wrapper {
          display: block;
        }
      }
    }
    .header {
      position: relative;
      display: flex;
      justify-content: space-between;
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #181f43;
        line-height: 22px;
      }
      .icon_wrapper {
        display: none;
        width: 20px;
        height: 20px;
        cursor: pointer;
        .more {
          display: block;
          width: 20px;
          height: 20px;
        }
      }
      .operation {
        position: absolute;
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
        color: #fff;
        background: rgba(6, 196, 152, 0.12);
        &.editing {
          background: #ecc58c;
        }
        &.used {
          background: #06c498;
        }
        &.stoped {
          background: #acbfba;
        }
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

type StatusMap = {
  className: string;
  text: string;
  status: number;
};

const Card: FC<{
  name: string;
  status: number;
  type: 1 | 2;
  className?: string;
  version?: { id: number; remark: string; version: string } | null | undefined;
}> = ({ name, status, type, className, version }) => {
  // const [isShowOperation, setIsShowOperation] = useState<boolean>(false);
  const statusObj: StatusMap = useMemo(() => {
    // 未发布(没有版本信息)的子应用为编排中状态
    if (!version) {
      return {
        className: 'editing',
        text: '编排中',
        status: 0,
      };
    }
    return status === 1
      ? { className: 'used', text: '已启用', status: 1 }
      : { className: 'stoped', text: '已停用', status: -1 };
  }, [status, version]);
  return (
    <Container className={className}>
      <div className="image" style={{ backgroundColor: type === 1 ? '#DFF5EF' : '#E7EBFD' }}>
        <img src={type === 1 ? ScreenImage : FlowImage} alt="图片" />
      </div>
      <div className="content">
        <div className="header">
          <div className="name">{getShorterText(name)}</div>
          <div className="icon_wrapper">
            <Icon type="gengduo" className="more" />
          </div>
          <div className="operation"></div>
        </div>
        <div className="footer">
          <div className={classNames('status', statusObj.className)}>{statusObj.text}</div>
          <div className="type">{type === 1 ? '大屏' : '流程'}</div>
        </div>
      </div>
    </Container>
  );
};

export default memo(Card);
