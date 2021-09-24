import React, { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import styles from './index.module.scss';
import {getComponentList} from './store';
import Header from "../header";
import Editor from "../editor";

const Container: FC = () => {
  const match = useRouteMatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getComponentList());
  }, [dispatch]);
  return (
    <div className={styles.container}>
      <Header/>
      <div>
        <Switch>
          <Route path={`${match.path}/editor`} component={Editor} />
        {/*  todo 扩展功能 */}
        </Switch>
      </div>
    </div>
  );
};

export default memo(Container);
