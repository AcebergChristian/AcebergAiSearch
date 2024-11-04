import './style/global.less';
import React, { useEffect, useState,  } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import indexstore from './store';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/login';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock';

const store = createStore(indexstore);

function Index() {

  // 设置默认语言为中文
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  // function fetchUserInfo() {
  //   store.dispatch({
  //     type: 'update-userInfo',
  //     payload: { userInfo: {path:'2356',key:'1835'}, userLoading: false },
  //   });
  // }

  // fetchUserInfo()


  // useEffect(() => {
  //   if (checkLogin()) {
  //     fetchUserInfo();
  //   } else if (window.location.pathname.replace(/\//g, '') !== 'login') {
  //     window.location.pathname = '/login';
  //   }
  // }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };
  
  
  return (
    <Router history={history}>
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
              <Switch>
                <Route path="/" component={PageLayout} />
                <Route path="/login" component={Login} />
                {/* <Route path="/" component={PageLayout} /> */}
                {/* {token ?
                  (<Route path="/" component={PageLayout} />)
                  :
                  (<Route path="/login" component={Login} />)
                } */}
              </Switch>
          </GlobalContext.Provider>
        </Provider>
      {/* </ConfigProvider> */}
    </Router>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));

