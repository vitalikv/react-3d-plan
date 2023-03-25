import * as THREE from 'three';
import { canvas, camOrbit } from './index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { level } from 'three-scene/index';
import { outlinePass, outlineSelectedObjs } from 'three-scene/core/composer-render';

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

    this.resetSelect();
    this.render();

    if (camOrbit.activeCam === camOrbit.cam3D) return;

    let ray = this.orderObjs(event);

    if (ray) {
      if (ray.object instanceof PointWall) ray.object.click({ pos: ray.point });
      if (ray.object instanceof Wall) ray.object.click({ pos: ray.point });

      this.obj = ray.object;
    }
  }

  protected orderObjs(event: MouseEvent) {
    let list = [level.getArrPointWall(), level.getArrWall()];

    let ray = null;

    for (let i = 0; i < list.length; i++) {
      let intersects = rayIntersect(event, list[i], 'arr');
      if (intersects.length === 0) continue;

      ray = intersects[0];
      break;
    }

    return ray;
  }

  resetSelect() {
    this.obj = null;
    //outlinePass.selectedObjects = [];
    outlineSelectedObjs();
  }

  render() {
    camOrbit.render();
  }
}
