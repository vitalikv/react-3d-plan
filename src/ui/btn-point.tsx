import React from 'react';
import * as Tscene from '../three-scene/index';

export default function Container() {
  function clickBtn() {
    promise_1().then((data) => {
      console.log(data);
    });
  }

  function promise_1(): Promise<any> {
    return new Promise((resolve, reject) => {
      document.onmousemove = function (event) {
        if (event.target === Tscene.canvas) {
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
