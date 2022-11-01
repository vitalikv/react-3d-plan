import { canvas } from 'three-scene/index';
import { addPointFromCat } from 'three-scene/plan/point/point-cat';

export class UIbtnPoint {
  elem: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    let container = document.body.querySelector('[nameId="containerScene2"]');
    container?.append(this.elem);

    this.initEvent();
  }

  html() {
    let html = `<div nameId="point" class="button1 gradient_1" style="position: absolute; left: 20px; top: 20px;">
          point 2
        </div>`;

    return html;
  }

  initEvent() {
    this.elem!.onmousedown = () => {
      this.promise_1().then((data) => {
        addPointFromCat({ event: data.event });
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
