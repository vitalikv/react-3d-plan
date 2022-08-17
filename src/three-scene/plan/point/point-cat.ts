import { canvas, camOrbit, planeMath, mouseEv } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from './point';

export function addPointFromCat({ event }: { event: MouseEvent }): void {
  planeMath.position.y = 0;
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  planeMath.updateMatrixWorld();

  let intersects = rayIntersect(event, planeMath, 'one');
  if (intersects.length === 0) return;

  let obj = new PointWall({ pos: intersects[0].point });

  canvas.onmousemove = (event) => {
    camOrbit.stopMove = true;
    mouseEv.stop = true;

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length === 0) return;

    obj.position.copy(intersects[0].point);

    camOrbit.render();
  };

  canvas.onmousedown = (event) => {
    canvas.onmousemove = null;
    canvas.onmousedown = null;

    camOrbit.stopMove = false;
    mouseEv.stop = false;

    camOrbit.render();

    if (event.button === 2) {
      obj.delete();
    } else {
      addPointFromCat({ event });
    }
  };
}
