import ListFloor from 'ui/right-panel/floor/list';

const styles: any = {
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

export default function PanelR() {
  let show = true;

  return (
    <div nameid="panelR" style={styles.panelR}>
      {show && <ListFloor />}
    </div>
  );
}
