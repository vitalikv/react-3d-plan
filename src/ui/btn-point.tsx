import React from 'react';
import { canvas } from '../three-scene/index';
import * as PointIndex from '../three-scene/plan/point/point-cat';

export default function Container() {
  function clickBtn() {
    promise_1().then((data) => {
      PointIndex.addPointFromCat({ event: data.event });
    });
  }

  function promise_1(): Promise<any> {
    return new Promise((resolve, reject) => {
      document.onmousemove = function (event) {
        if (event.target === canvas) {
          document.onmousemove = null;
          resolve({ event: event });
        }
      };
    });
  }

  return (
    <div>
      <div nameid="panelT" onClick={(e) => clickBtn()} className="button1 gradient_1" style={{ position: 'absolute', left: '20px', top: '60px', zIndex: 1 }}>
        point 2
      </div>
    </div>
  );
}
