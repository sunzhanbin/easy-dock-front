import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import useMemoCallback from '@common/hooks/use-memo-callback';
import { load, flowDataSelector, addNode } from './flow-slice';
import { Flow } from './nodes';

function FlowDesign() {
  const dispath = useDispatch();
  const { loading, data: flow, fieldsTemplate } = useSelector(flowDataSelector);

  useEffect(() => {
    dispath(load('appkey'));
  }, [dispath]);

  return (
    <div>
      <Flow data={flow} />
    </div>
  );
}

export default React.memo(FlowDesign);
