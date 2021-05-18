import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { load, flowDataSelector, addNode } from './flow-slice';
import { createNode } from './util';
import { NodeType } from './types';

function FlowDesign() {
  const dispath = useDispatch();
  const { loading, data: flow, fieldsTemplate } = useSelector(flowDataSelector);

  useEffect(() => {
    dispath(load('appkey'));
  }, [dispath]);

  return <div></div>;
}

export default React.memo(FlowDesign);
