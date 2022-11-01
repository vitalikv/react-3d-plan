import { UIheader } from 'ui/top-panel/header';
import { UIbtnCam } from 'ui/body/btn-camera';
import { UIbtnPoint } from 'ui/body/btn-point';
import { UIinpit } from 'ui/body/wall/ui';
import { UIrightPanel } from 'ui/right-panel/right-panel';

type Itp = { header?: UIheader };
type Icanv = { btnCam?: UIbtnCam; btnPoint?: UIbtnPoint; wall: { input?: UIinpit } };

export class UImain {
  tp: Itp = {};

  canvas: Icanv = {
    btnCam: undefined,
    wall: { input: undefined },
  };

  rp: undefined | UIrightPanel = undefined;

  constructor() {
    this.tp.header = new UIheader();
    this.canvas.btnCam = new UIbtnCam();
    this.canvas.btnPoint = new UIbtnPoint();
    this.canvas.wall.input = new UIinpit();
    this.rp = new UIrightPanel();
  }
}
