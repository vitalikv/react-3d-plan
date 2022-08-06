import React, { useState } from 'react';
import * as Tscene from '../three-scene/index';

declare module 'react' {
  export interface HTMLAttributes<T> {
    nameid?: any;
  }
}

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    height: '100%',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  panelT: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '40px',
    background: '#F0F0F0',
    borderBottom: '1px solid #D1D1D1',
    boxSizing: 'border-box',
  },

  wrap: {
    display: 'flex',
    height: '100%',
  },

  wrap2: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  wrap3: {
    display: 'flex',
    position: 'relative',
    height: 0,
    top: 0,
    left: 0,
    right: 0,
  },

  wrapBtnCam: {
    position: 'absolute',
    right: '330px',
    top: '55px',
    zIndex: 1,
  },

  btnCam: {
    width: 'auto',
    height: '11px',
    margin: 'auto',
    userSelect: 'none',
    textAlign: 'center',
    padding: '6px 11px',
    border: 'solid 1px #b3b3b3',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#737373',
    cursor: 'pointer',
  },

  btnGradient: {
    backgroundColor: '#ffffff',
    backgroundImage: '-webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%)',
    boxShadow: '0px 0px 2px #bababa, inset 0px 0px 1px #ffffff',
  },

  panelR: {
    position: 'absolute',
    top: '40px',
    right: 0,
    bottom: 0,
    width: '310px',
    boxSizing: 'border-box',
    background: '#F0F0F0',
    borderLeft: '1px solid #D1D1D1',
  },
};

export default function Container() {
  let arr = [
    { id: 1, type: '2D', display: '' },
    { id: 2, type: '3D', display: '' },
  ];

  const [btns, setState] = useState(arr);

  const clickBtn = ({ type, name }: { type: string; name?: null | string }) => {
    let newArr: Array<any> = [...btns];

    if (type === '2D') {
      newArr[0].display = 'none';
      newArr[1].display = '';
    }
    if (type === '3D') {
      newArr[0].display = '';
      newArr[1].display = 'none';
    }

    Tscene.camOrbit.setActiveCam({ cam: type });

    setState(newArr);

    // setState(
    //   btns.map((item) => {
    //     item.display = 'none';
    //     if (item.type === type) {
    //       item.display = '';

    //       //Tscene.camOrbit.setActiveCam({ cam: item.type });
    //     }
    //     return item;
    //   })
    // );
  };
  console.log(444);
  return (
    <div>
      <div nameid="panelT" style={styles.panelT}></div>

      <div nameid="panelR" style={styles.panelR}>
        <div nameid="wrapLevel"></div>
      </div>

      <div style={styles.wrapBtnCam}>
        <div nameid="cam2D" onClick={(e) => clickBtn({ type: '2D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: btns[0].display }}>
          2D
        </div>
        <div nameid="cam3D" onClick={(e) => clickBtn({ type: '3D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: btns[1].display }}>
          3D
        </div>
      </div>
    </div>
  );
}
