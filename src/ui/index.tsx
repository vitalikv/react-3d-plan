import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { apiUiToThree } from 'api/ui-three';

import PanelR from 'ui/right-panel/index';
import BtnCamera from 'ui/body/btn-camera';

import BtnPoint2 from './body/btn-point';
import Slider from './slider/index';
import { store } from './store/store';

declare module 'react' {
  export interface HTMLAttributes<T> {
    nameid?: any;
  }
}

export default function Ui() {
  useEffect(() => {
    console.log('useEffect всей страницы');
    apiUiToThree.readyUi();
  });

  return (
    <div>
      <div nameid="panelT" className="panelT">
        <div className="title">Test 3D</div>
      </div>

      <Provider store={store}>
        <PanelR />
        <BtnCamera />
      </Provider>

      <BtnPoint2 />
      <Slider />
    </div>
  );
}
