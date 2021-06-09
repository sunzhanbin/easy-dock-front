import { memo, useState, useCallback, FC } from 'react';
import styled from 'styled-components';
import FlowImage from '@assets/flow-icon.png';
import ScreenImage from '@assets/screen-icon.png';
import { Icon } from '@/components';
import { Form, Input, Button } from 'antd';
import { axios } from '@/utils';

const Container = styled.div`
  display: flex;
  width: 812px;
  height: 394px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  .flow_app,
  .screen_app {
    position: relative;
    width: 394px;
    height: 394px;
    text-align: center;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid rgba(24, 31, 67, 0.5);
    cursor: pointer;
    .close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 16px;
      height: 16px;
      z-index: 3;
      cursor: pointer;
      .back {
        display: inline-block;
        width: 16px;
        height: 16px;
      }
    }
    .title {
      height: 34px;
      line-height: 34px;
      font-size: 24px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      margin-top: 68px;
    }
    .tip {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(24, 31, 67, 0.5);
      margin-top: 8px;
    }
    .image {
      margin-top: 34px;
    }
  }
  .flow_app {
    margin-right: 24px;
    .form {
      width: 330px;
      margin: 0 auto;
      margin-top: 40px;
      .submit {
        width: 100%;
      }
    }
  }
`;

const EmptyDetail: FC<{ appId: string }> = ({ appId }) => {
  const [form] = Form.useForm();
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const handleClose = useCallback(
    (e) => {
      e.stopPropagation();
      setCanEdit(false);
    },
    [setCanEdit],
  );
  const handleFinish = useCallback(() => {
    form.validateFields().then(({ subAppName }: { subAppName: string }) => {
      axios.post('/subapp', { appId, name: subAppName, type: 2 }).then((res) => {
        console.info(res);
        // 跳转到流程编排子应用，暂时未实现
      });
    });
  }, [form, appId]);
  return (
    <Container>
      <div
        className="flow_app"
        onClick={() => {
          setCanEdit(true);
        }}
      >
        {canEdit && (
          <div className="close" onClick={handleClose}>
            <Icon className="back" type="guanbi" />
          </div>
        )}
        <div className="title">新建流程子应用</div>
        <div className="tip">可配置表单、流程、列表</div>
        {canEdit ? (
          <Form form={form} layout="vertical" className="form" onFinish={handleFinish}>
            <Form.Item
              label="子应用名称"
              name="subAppName"
              required
              rules={[{ required: true, message: '请输入子应用名称' }]}
            >
              <Input size="large" placeholder="请输入" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" className="submit" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <img className="image" src={FlowImage} alt="新建流程子应用" />
        )}
      </div>
      <div className="screen_app">
        <div className="title">新建大屏子应用</div>
        <div className="tip">用于配置可视化大屏及其所需的数据、接口</div>
        <img className="image" src={ScreenImage} alt="新建流程子应用" />
      </div>
    </Container>
  );
};

export default memo(EmptyDetail);
