import React, { useState } from 'react';
import './index.scss';

let data: Array<any> = [];

export default function Slider() {
  const [item, setItem] = useState(data);
  const [index, setIndex] = useState(0);

  console.log(index);

  return (
    <div>
      <div className="wpap">
        <div className="popup">Test 3D</div>
      </div>
    </div>
  );
}
