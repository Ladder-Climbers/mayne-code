import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './data/store';
import { Provider } from 'react-redux';
import { api } from './api/api';
import { sleep } from './utils/utils';
import reportWebVitals from './reportWebVitals';
import { setConfig, setErrorInfo, setUser } from './data/action';

// 循环执行函数
async function cycleFunc(cycle = 1000) {
  while (true) {
    try {
    } catch (e) {
      console.error(e);
    }
    await sleep(cycle);
  }
}

// 开始执行的函数
async function startFunc() {
  setTimeout(async () => {
    const user = store.getState().user;
    const isNowLogining = !user && store.getState().config.data.api_token.access_token;
    if (isNowLogining) {
      api.load_from_config();
      const res = await api.request('user', 'GET');
      // console.log('index res', res)
      if (res.code === 200) {
        // console.log('saving user', res.data.user)
        store.dispatch(setUser(res.data.user));
      }
    }
  }, 0);
}

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

startFunc().then(() => {
  cycleFunc();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
