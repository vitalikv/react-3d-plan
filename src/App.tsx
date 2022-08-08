import React from 'react';
import { Provider } from 'react-redux';

//import logo from './logo.svg';

import BtnCam from './ui/btn-cam';
import BtnPoint from './ui/btn-point';
import { store } from './ui/store/store';

function App() {
  return (
    <div>
      <Provider store={store}>
        <BtnCam />
      </Provider>

      <BtnPoint />
    </div>
  );
}

export default App;
