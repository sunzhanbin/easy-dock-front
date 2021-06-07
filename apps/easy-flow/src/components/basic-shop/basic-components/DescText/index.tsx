import React, { memo, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  line-height: 22px;
  min-height: 22px;
  .tip {
    color: #dcdcdc;
  }
`;

const DescText = (props: { content: string }) => {
  const { content } = props;
  const renderContent = useCallback(() => {
    if (!content || content.trim() === '<p></p>') {
      return <div className="tip">请补充描述性文字</div>;
    }
    return <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>;
  }, [content]);
  return <Container>{renderContent()}</Container>;
};

export default memo(DescText);
