import { canvas } from './index';
import { rayIntersect } from './core/rayhit';
import { points } from './plan/point/point';
import { PointWall } from './plan/point/point';

export class Mouse {
  canvas;
  stop;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.stop = false;
    this.canvas = canvas;
    this.initEvent();
  }

  initEvent() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.mouseDown(event);
    });

    document.addEventListener('keydown', () => {
      //deleteKey();
    });
  }

  mouseDown(event: MouseEvent) {
    if (!event) return;
    if (this.stop) return;

    let button = '';

    switch (event.button) {
      case 0:
        button = 'left';
        break;
      case 1:
        button = 'right';
        break;
      case 2:
        button = 'right';
        break;
      default:
        button = 'left';
    }

    if (button === 'right') return;

    let intersects = rayIntersect(event, [...points], 'arr');
    if (intersects.length === 0) return;

    let obj = intersects[0].object;

    if (obj instanceof PointWall) obj.click({ pos: intersects[0].point });
  }
}
