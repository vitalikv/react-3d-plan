import { camOrbit, mouseEv } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { outlinePass } from 'three-scene/core/composer-render';

export function deletePointBtn({ point }: { point: PointWall }) {
  let p = point.userInfo.point;
  let w = point.userInfo.wall;
  if (p.length > 2) return;

  outlinePass.selectedObjects = [];
  mouseEv.clear();

  point.delete();

  // удаляем из соседних точек инфу удалемой точки и о стенах
  p.forEach((p1) => p1.delPoint({ point }));
  w.forEach((wall) => {
    p.forEach((point) => point.delWall({ wall }));
  });

  // удаляем стены
  w.forEach((wall) => wall.delete());

  if (p.length === 2) {
    new Wall({ p1: p[0], p2: p[1] });
    return;
  }

  p.forEach((point) => {
    if (point.userInfo.wall.length === 0 && point.userInfo.point.length === 0) point.delete();
  });

  camOrbit.render();
}
