import { useDispatch, useSelector } from 'react-redux';
import { toggle } from 'ui/store/slice/btnCamSlice';
import { level, camOrbit, mouseEv } from 'three-scene/index';

const styles: any = {
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

export default function BtnCamera() {
  const dispatch = useDispatch();
  let stateCam: any = useSelector((state: any) => state.btnCam);

  console.log(stateCam);

  stateCam.forEach((item: any) => {
    if (item.display === '') {
      mouseEv.resetSelect();
      level.switchCamera({ type: item.type });
      camOrbit.setActiveCam(item.type);
    }
  });

  const clickBtn = ({ type, name }: { type: string; name?: null | string }) => {
    dispatch(toggle({ type }));
    console.log(type);
  };

  return (
    <div style={styles.wrapBtnCam}>
      <div nameid="cam2D" onClick={(e) => clickBtn({ type: '2D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: stateCam[0].display }}>
        2D
      </div>
      <div nameid="cam3D" onClick={(e) => clickBtn({ type: '3D' })} style={{ ...styles.btnCam, ...styles.btnGradient, display: stateCam[1].display }}>
        3D
      </div>
    </div>
  );
}
