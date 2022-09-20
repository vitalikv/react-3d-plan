import * as THREE from 'three';
import { canvas } from './index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { level } from 'three-scene/index';

export class Mouse {
  canvas;
  stop;
  obj: PointWall | Wall | THREE.Mesh | null;

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.stop = false;
    this.obj = null;
    this.canvas = canvas;
    this.initEvent();
  }

  initEvent() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.mouseDown(event);
    });
  }

  protected mouseDown(event: MouseEvent) {
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

    let intersects = rayIntersect(event, level.getArrObjs(), 'arr');
    if (intersects.length === 0) return;

    let obj = intersects[0].object;

    if (obj instanceof PointWall) obj.click({ pos: intersects[0].point });
    if (obj instanceof Wall) obj.click({ pos: intersects[0].point });

    this.obj = obj;
  }
}
