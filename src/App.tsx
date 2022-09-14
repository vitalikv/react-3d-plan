import React from 'react';
import { Provider } from 'react-redux';

//import logo from './logo.svg';

import Main from './ui/index';
import BtnPoint from './ui/btn-point';
import Slider from './ui/slider/index';
import { store } from './ui/store/store';

function App() {
  return (
    <div>
      <Provider store={store}>
        <Main />
      </Provider>

      <BtnPoint />
      <Slider />
    </div>
  );
}

export default App;
