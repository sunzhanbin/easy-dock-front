import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { load, flowActions, flowDataSelector } from './flow-slice';
import { createInitialFlow } from './util';

function FlowDesign() {
  const dispath = useDispatch();
  const { loading, data, fieldsTemplate } = useSelector(flowDataSelector);

  useEffect(() => {
    dispath(load('appkey'))
      .then(unwrapResult)
      .then((flow) => {
        if (!flow) {
          dispath(flowActions.setInitialFlow(createInitialFlow()));
        } else {
          dispath(flowActions.setInitialFlow(flow));
        }
      });
  }, []);

  return <div></div>;
}

export default React.memo(FlowDesign);
