import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from './store/btnCamSlice';
import * as Tscene from '../three-scene/index';
import PanelR from 'ui/right-panel/index';

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
};

export default function Container() {
  const dispatch = useDispatch();
  let stateCam: any = useSelector((state: any) => state.btnCam);

  console.log(stateCam);

  stateCam.forEach((item: any) => {
    if (item.display === '') Tscene.camOrbit.setActiveCam(item.type);
  });

  const clickBtn = ({ type, name }: { type: string; name?: null | string }) => {
    dispatch(toggle({ type }));
    console.log(type);
  };

  return (
    <div>
      <div nameid="panelT" className="panelT">
        <div className="title">Test 3D</div>
      </div>

      <PanelR />

      <div style={styles.wrapBtnCam}>
        <div nameid="cam2D" onClick={(e) => clickBtn({ type: '2D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: stateCam[0].display }}>
          2D
        </div>
        <div nameid="cam3D" onClick={(e) => clickBtn({ type: '3D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: stateCam[1].display }}>
          3D
        </div>
      </div>
    </div>
  );
}
