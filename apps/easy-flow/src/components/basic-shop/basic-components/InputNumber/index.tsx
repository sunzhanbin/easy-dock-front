import React, { memo } from 'react';
import styled from 'styled-components';
import { InputNumber } from 'antd';
import { SingleTextField } from '@/type';
import { useCallback } from 'react';

const TextareaComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  .number_container {
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 40px;
      height: 40px;
      .iconfont {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        margin: 12px;
      }
    }
    .ant-input-number {
      width: 100%;
      .ant-input-number-input {
        padding-left: 40px;
      }
    }
  }
`;

const TextareaComponent = (props: SingleTextField & { id: string; onChange: (v: number) => void }) => {
  const { defaultValue, readonly, value, onChange } = props;
  const handleChange = useCallback(
    (e) => {
      onChange && onChange(e);
    },
    [onChange],
  );

  return (
    <TextareaComponentContainer>
      <div className="number_container">
        <div className="icon">
          <span className="iconfont iconshuzi123"></span>
        </div>
        <InputNumber
          size="large"
          placeholder="请输入"
          defaultValue={defaultValue}
          value={defaultValue}
          readOnly={readonly}
          onChange={handleChange}
        />
      </div>
    </TextareaComponentContainer>
  );
};

export default memo(TextareaComponent);
