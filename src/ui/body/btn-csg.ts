import { canvas } from 'three-scene/index';
import { myCSG } from 'three-scene/index';

export class UIbtnCSG {
  btnWind: HTMLElement | null = null;
  btnDoor: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  init() {
    let container = document.body.querySelector('[nameId="containerScene2"]');

    let div = document.createElement('div');
    div.innerHTML = this.htmlWind();
    this.btnWind = div.children[0] as HTMLElement;
    container?.append(this.btnWind);

    div = document.createElement('div');
    div.innerHTML = this.htmlDoor();
    this.btnDoor = div.children[0] as HTMLElement;
    container?.append(this.btnDoor);

    this.initEvent();
  }

  htmlWind() {
    let html = `
        <div nameId="point" class="button1 gradient_1" style="position: absolute; left: 20px; top: 80px;">
          wind
        </div>`;

    return html;
  }

  htmlDoor() {
    let html = `
        <div nameId="point" class="button1 gradient_1" style="position: absolute; left: 20px; top: 110px;">
          door
        </div>`;

    return html;
  }

  initEvent() {
    this.btnWind!.onmousedown = () => {
      this.promise_1().then((data) => {
        myCSG.click({ event: data.event, type: 'wind' });
      });
    };

    this.btnDoor!.onmousedown = () => {
      this.promise_1().then((data) => {
        myCSG.click({ event: data.event, type: 'door' });
      });
    };
  }

  promise_1(): Promise<any> {
    return new Promise((resolve, reject) => {
      document.onmousemove = function (event) {
        if (event.target === canvas) {
          document.onmousemove = null;
          resolve({ event: event });
        }
      };
    });
  }
}
