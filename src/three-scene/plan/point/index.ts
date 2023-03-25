import * as THREE from 'three';
import { scene, camOrbit, mouseEv, level } from 'three-scene/index';
import { rayFromPointToObj } from 'three-scene/core/rayhit';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';
import { outlinePass, outlineSelectedObjs } from 'three-scene/core/composer-render';
import { cornersWall } from 'three-scene/plan/wall/corners-wall';
import { flooring } from 'three-scene/plan/floor/index';

class GeomPoint {
  geometry = this.crGeom();

  crGeom() {
    let geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 18);

    let attrP: any = geometry.getAttribute('position');

    for (let i = 0; i < attrP.array.length; i += 3) {
      attrP.array[i + 0] *= 0.5; // x
      attrP.array[i + 2] *= 0.5; // z

      let y = attrP.array[i + 1];
      if (y < 0) {
        attrP.array[i + 1] = 0;
      }
    }

    geometry.attributes.position.needsUpdate = true;

    geometry.userData.attrP = geometry.getAttribute('position').clone();

    return geometry;
  }

  scaleGeom({ value }: { value: number }) {
    if (value < 0.3) value = 0.3;

    let geometry = this.geometry;

    let attrP = geometry.userData.attrP;
    let attrP_2 = [];

    for (let i = 0; i < attrP.array.length; i += 3) {
      attrP_2[i + 0] = attrP.array[i + 0] / value; // x
      attrP_2[i + 2] = attrP.array[i + 2] / value; // z

      attrP_2[i + 1] = attrP.array[i + 1]; // y
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(attrP_2), 3));
    geometry.attributes.position.needsUpdate = true;
  }
}

export let geomPoint = new GeomPoint();

export function deletePointBtn({ point }: { point: PointWall }) {
  let w = point.userInfo.wall;

  // получаем соседние точки
  let p: PointWall[] = [];
  for (let i = 0; i < w.length; i++) p.push(...w[i].userInfo.point);
  p = Array.from(new Set(p)); // удаляем повторяющиеся точки
  p = p.filter((item) => item !== point); // удаляем точку которую ходим удалить, оставляем только соседние

  if (p.length > 2) return;

  //outlinePass.selectedObjects = [];
  outlineSelectedObjs();
  mouseEv.obj = null;

  flooring.deleteFloors({ point });
  point.delete();

  // удаляем из соседних точек инфу о стенах
  w.forEach((wall) => {
    p.forEach((point) => point.delWall({ wall }));
  });

  // удаляем стены
  w.forEach((wall) => wall.delete());

  if (p.length === 2) {
    new Wall({ p1: p[0], p2: p[1] });
  } else {
    p.forEach((point) => {
      if (point.userInfo.wall.length === 0) point.delete();
    });
  }

  p.forEach((point) => {
    if (point.userInfo.wall.length > 0) cornersWall.move({ point: point });
  });

  flooring.calc();

  camOrbit.render();
}

// ищем ближайшие точки, чтобы подтянуть/прилипнуть к ним
export function nearPoint({ point }: { point: PointWall }) {
  let newPos = null;
  let pos = point.position.clone();
  let points = level.getArrPointWall();

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
export function finishSelectPoint({ obj, tool }: { obj: PointWall; tool?: boolean }) {
  let o = rayFromPointToObj({ obj, arr: level.getArrPointWall() });
  let w2 = { divide: false };

  // точка состыковалась с точкой
  if (o !== null && o instanceof PointWall) {
    //outlinePass.selectedObjects = [];
    outlineSelectedObjs();
    mouseEv.obj = null;
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

    if (o.userInfo.wall.length === 0 && !tool) o.delete();

    camOrbit.render();
  } else {
    //w2 = this.divideWall({obj: obj});
  }

  if (o) cornersWall.move({ point: o });

  flooring.calc();

  return o;
}
