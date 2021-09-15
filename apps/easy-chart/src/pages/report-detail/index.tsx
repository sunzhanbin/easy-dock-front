import React, { FC, memo, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import styles from './index.module.scss';
import Header from "../editor-header";
import Editor from "../editor";

const Container: FC = () => {
  const match = useRouteMatch();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // todo
    // dispatch(getComponentList());
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
