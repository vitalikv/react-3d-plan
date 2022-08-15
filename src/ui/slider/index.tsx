import React, { useState } from 'react';
import './index.scss';

import img1 from '../../img/screenshot_1.jpg';
import img2 from '../../img/screenshot_2.jpg';
import img3 from '../../img/screenshot_3.jpg';

export default function Slider() {
  let data: Array<any> = [img1, img2, img3];

  const [item, setItem] = useState(data);
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('flex');

  function newSlide({ value }: { value: number }): void {
    if (index + value > data.length - 1) value = 0;
    else if (index + value < 0) value = data.length - 1;
    else value = index + value;
    //setIndex((prevState) => prevState + value);
    setIndex(value);
  }

  function closePopup({ event }: { event: React.MouseEvent<HTMLElement> }): void {
    let styleD = display === 'flex' ? 'none' : 'flex';
    setDisplay(styleD);
  }

  return (
    <div>
      <div className="wpap" onClick={(e) => closePopup({ event: e })} style={{ display: display }}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          Test 3D
          <div style={{ width: '100%', height: '100%' }}>
            <img src={item[index]} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
          </div>
          <div style={{ display: 'flex', margin: '10px auto' }}>
            <div
              onClick={(e) => {
                newSlide({ value: -1 });
              }}
              className="button1 gradient_1"
            >
              назад
            </div>
            <div
              onClick={(e) => {
                newSlide({ value: 1 });
              }}
              className="button1 gradient_1"
            >
              вперед
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
