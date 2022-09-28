import { canvas, camOrbit, planeMath, mouseEv } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { nearPoint, finishSelectPoint } from 'three-scene/plan/point/index';
import { PointWall } from './point';
import { Wall } from 'three-scene/plan/wall/index';
import { deletePointBtn } from 'three-scene/plan/point/index';
import { level } from 'three-scene/index';

export function addPointFromCat({ event, obj1 }: { event: MouseEvent; obj1?: PointWall }): void {
  planeMath.position.y = level.getPosY1();
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  planeMath.updateMatrixWorld();

  let intersects = rayIntersect(event, planeMath, 'one');
  if (intersects.length === 0) return;

  let obj = new PointWall({ pos: intersects[0].point });

  if (obj1) {
    obj.position.copy(obj1.position);
    new Wall({ p1: obj1, p2: obj });
  }

  canvas.onmousemove = (event) => {
    camOrbit.stopMove = true;
    mouseEv.stop = true;

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length === 0) return;

    obj.position.copy(intersects[0].point);

    let newPos = nearPoint({ point: obj });
    if (newPos) obj.position.copy(newPos);

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
      let crP = true;
      if (obj.userInfo.wall.length === 0) {
        let pointCross = finishSelectPoint({ obj, tool: true });

        if (pointCross instanceof PointWall) obj = pointCross;
        console.log('pointCross', pointCross);
      }
      if (obj.userInfo.wall.length > 0) {
        let pointCross = finishSelectPoint({ obj: obj });
        if (pointCross) crP = false;
      }

      if (crP) addPointFromCat({ event, obj1: obj });
    }
  };
}
