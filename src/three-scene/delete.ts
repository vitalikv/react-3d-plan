import { mouseEv } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { deletePointBtn } from 'three-scene/plan/point/index';

export function initDeleteObj() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') deleteObj();
  });
}

function deleteObj() {
  let obj = mouseEv.obj;

  if (obj instanceof PointWall) deletePointBtn({ point: obj });
  if (obj instanceof Wall) obj.deleteWallPoint();
}
