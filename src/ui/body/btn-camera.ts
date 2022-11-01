import { level, camOrbit, mouseEv } from 'three-scene/index';

export class UIbtnCam {
  elem: HTMLElement | null = null;
  btnCam2D: HTMLElement | null = null;
  btnCam3D: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    let container = document.body.querySelector('[nameId="containerScene2"]');
    container?.append(this.elem);

    this.btnCam2D = this.elem.querySelector('[nameId="cam2D"]');
    this.btnCam3D = this.elem.querySelector('[nameId="cam3D"]');

    this.initEvent();
  }

  html() {
    let cssbtnCam = `width: auto; height: 11px; margin: auto; user-select: none; text-align: center; padding: 6px 11px; border: solid 1px #b3b3b3; border-radius: 4px; font-size: 12px; color: #737373; cursor: pointer;`;

    let cssbtnGradient = `background: #ffffff; background-image:-webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;`;

    let html = `<div style="position: absolute; right: 20px; top: 15px;">
          <div nameId="cam2D" style="display: block; ${cssbtnCam} ${cssbtnGradient}">
            2D
          </div>
          <div nameId="cam3D" style="display: none; ${cssbtnCam} ${cssbtnGradient}">
            3D
          </div>
        </div>`;

    return html;
  }

  initEvent() {
    this.btnCam2D!.onmousedown = () => {
      this.clickBtn('3D');
    };

    this.btnCam3D!.onmousedown = () => {
      this.clickBtn('2D');
    };
  }

  showBtn(type: string) {
    this.btnCam2D!.style.display = 'none';
    this.btnCam3D!.style.display = 'none';

    if (type === '2D') this.btnCam2D!.style.display = 'block';
    if (type === '3D') this.btnCam3D!.style.display = 'block';
  }

  clickBtn(type: string) {
    this.showBtn(type);

    mouseEv.resetSelect();
    level.switchCamera({ type });
    camOrbit.setActiveCam(type);
  }
}
