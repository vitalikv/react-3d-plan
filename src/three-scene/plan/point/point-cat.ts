import { canvas, camOrbit, planeMath, mouseEv } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from './point';
import { Wall } from 'three-scene/plan/wall/index';
import { deletePointBtn } from 'three-scene/plan/point/index';

export function addPointFromCat({ event, obj1 }: { event: MouseEvent; obj1?: PointWall }): void {
  planeMath.position.y = 0;
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  planeMath.updateMatrixWorld();

  let intersects = rayIntersect(event, planeMath, 'one');
  if (intersects.length === 0) return;

  let obj = new PointWall({ pos: intersects[0].point });

  if (obj1) {
    new Wall({ p1: obj1, p2: obj });
  }

  canvas.onmousemove = (event) => {
    camOrbit.stopMove = true;
    mouseEv.stop = true;

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length === 0) return;

    obj.position.copy(intersects[0].point);

    obj.userInfo.wall.forEach((o) => {
      if (o instanceof Wall) o.updateGeomWall();
    });

    camOrbit.render();
  };

  canvas.onmousedown = (event) => {
    canvas.onmousemove = null;
    canvas.onmousedown = null;

    camOrbit.stopMove = false;
    mouseEv.stop = false;

    camOrbit.render();

    if (event.button === 2) {
      deletePointBtn({ point: obj });
    } else {
      addPointFromCat({ event, obj1: obj });
    }
  };
}
