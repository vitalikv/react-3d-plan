import * as THREE from 'three';
import { canvas, camOrbit, planeMath } from '../../index';
import { rayIntersect } from '../../core/rayHit';
import { PointWall } from './point';
import { store } from '../../../ui/store/store';
import { toggle } from '../../../ui/store/btnCamSlice';

export function crBtnPointWall({ container, canvas }: { container: HTMLElement; canvas: HTMLCanvasElement }): void {
  //let el: HTMLElement | null = Tscene.container.querySelector('[nameId="blockButton_1"]');
  let html = '<div style="position: absolute; left: 60px; top: 40px;" class="button1 gradient_1">point 1</div>';
  let div = document.createElement('div');
  div.innerHTML = html;
  let elem = div.firstChild as HTMLElement;

  container.append(elem);

  const { dispatch } = store;

  elem.onmouseup = () => {
    promise_1().then((data) => {
      console.log(data);
      dispatch(toggle({ type: '2D' }));
    });
  };

  function promise_1(): Promise<any> {
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

export function addPointFromCat({ event }: { event: MouseEvent }): void {
  planeMath.position.y = 0;
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  planeMath.updateMatrixWorld();

  let intersects = rayIntersect(event, planeMath, 'one');
  if (intersects.length == 0) return;

  console.log(intersects[0].point);
  let obj = new PointWall({ pos: intersects[0].point });

  canvas.onmousemove = (event) => {
    camOrbit.stopMove = true;

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length == 0) return;

    obj.position.copy(intersects[0].point);

    camOrbit.render();
  };

  canvas.onmousedown = (event) => {
    canvas.onmousemove = null;
    canvas.onmousedown = null;

    camOrbit.stopMove = false;

    camOrbit.render();

    if (event.button == 2) {
      //this.deleteObj();
    } else {
      //MOVEPOINT.endPoint({ obj: obj, tool: true });
    }
  };
}
