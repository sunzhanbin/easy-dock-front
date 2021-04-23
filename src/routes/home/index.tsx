import { Switch, Route } from 'react-router-dom';
import useMatchRoute from '@hooks/use-match-route';
import Main from './main';

export default function Home() {
  const mathedRoute = useMatchRoute();

  return (
    <Switch>
      <Route path={`${mathedRoute}`} component={Main}></Route>
    </Switch>
  );
}
