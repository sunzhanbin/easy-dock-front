import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: '/',
  getUserConfirmation(a, b) {
    debugger;
    console.log(a, b);
  },
});

export default history;
