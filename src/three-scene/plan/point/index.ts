import { scene, camOrbit, mouseEv } from 'three-scene/index';
import { rayFromPointToObj } from 'three-scene/core/rayhit';
import { points, PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { outlinePass } from 'three-scene/core/composer-render';

export function deletePointBtn({ point }: { point: PointWall }) {
  let w = point.userInfo.wall;

  // получаем соседние точки
  let p: PointWall[] = [];
  for (let i = 0; i < w.length; i++) p.push(...w[i].userInfo.point);
  p = Array.from(new Set(p)); // удаляем повторяющиеся точки
  p = p.filter((item) => item !== point); // удаляем точку которую ходим удалить, оставляем только соседние

  if (p.length > 2) return;

  outlinePass.selectedObjects = [];
  mouseEv.clear();

  point.delete();

  // удаляем из соседних точек инфу о стенах
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
    if (point.userInfo.wall.length === 0) point.delete();
  });

  camOrbit.render();
}

// ищем ближайшие точки, чтобы подтянуть/прилипнуть к ним
export function nearPoint({ point }: { point: PointWall }) {
  let newPos = null;
  let pos = point.position.clone();

  for (let i = 0; i < points.length; i++) {
    if (points[i] === point) continue;

    //if(Math.abs(points[i].position.y - point.position.y) > 0.01) continue;

    if (pos.distanceTo(points[i].position) > 0.2 / camOrbit.cam2D.zoom) continue;

    newPos = points[i].position.clone();
    break;
  }

  return newPos;
}

// закончили действия с перетаскиваемой pointWall
export function finishSelectPoint({ obj }: { obj: PointWall }) {
  let o = rayFromPointToObj({ obj: obj, arr: points });
  let w2 = { divide: false };

  // точка состыковалась с точкой
  if (o !== null && o instanceof PointWall) {
    let w = obj.userInfo.wall;

    // получаем соседние точки
    let p: PointWall[] = [];
    for (let i = 0; i < w.length; i++) p.push(...w[i].userInfo.point);
    p = Array.from(new Set(p)); // удаляем повторяющиеся точки
    p = p.filter((item) => item !== obj); // удаляем точку которую ходим удалить, оставляем только соседние

    // удаляем из соседних стен инфу об удалемой точки
    w.forEach((item) => item.delPoint({ point: obj }));

    // если колапсирующая точка оказалась сосесдней
    let exsist = p.find((item) => item === o);
    if (exsist) {
      let wall: Wall | undefined = undefined;
      let w2 = o.userInfo.wall;

      for (let i = 0; i < w.length; i++) {
        let res = w2.find((item) => item === w[i]);
        if (res) wall = res;
      }

      if (wall) {
        w = w.filter((w1) => w1 !== wall);

        for (let i = 0; i < p.length; i++) p[i].delWall({ wall });

        wall.delete();
      }
    }

    obj.delete();

    // назначаем соседним стенам новую точку
    for (let i = 0; i < w.length; i++) w[i].addPoint({ point: o });

    // назначаем новой точки новые стены
    for (let i = 0; i < w.length; i++) o.addWall({ wall: w[i] });

    if (o.userInfo.wall.length === 0) o.delete();

    camOrbit.render();
  } else {
    //w2 = this.divideWall({obj: obj});
  }
}
