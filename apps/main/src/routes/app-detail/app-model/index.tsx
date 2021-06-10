import { memo, FC } from 'react';
import styled from 'styled-components';
import { Icon } from '@/components';
import { Input } from 'antd';
import FlowImage from '@assets/flow-small.png';
import ScreenImage from '@assets/screen-small.png';

const Container = styled.div``;

const AppModel: FC<{ type: 'create' | 'edit'; onClose: () => void; onConfirm: () => void }> = ({ type }) => {
  return (
    <Container>
      <div className="header">
        <div className="title">{type === 'create' ? '新建' : '编辑'}子应用</div>
        <div className="close">
          <Icon type="guanbi" />
        </div>
        <div className="content">
          <div className="form-item">
            <div className="label">子应用名称</div>
            <div className="name">
              <Input />
            </div>
          </div>
          <div className="form-item">
            <div className="label">子应用类型</div>
            <div className="type">
              <div className="flow"></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default memo(AppModel);
