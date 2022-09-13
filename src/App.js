import React from 'react';
import Router from './routes'
import store from './store/store'
import { Provider } from 'react-redux'
import './App.less'
import './assets/css/reset.css'


function App() {

  return (
      <Provider store={store}>
        <Router/>
      </Provider>
  );
}

export default App;
