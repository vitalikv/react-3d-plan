import * as THREE from 'three';
import { scene, camOrbit } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from '../point/point';

class CornersWall {
  start({ wall }: { wall: Wall }) {
    if (wall.material instanceof THREE.MeshStandardMaterial) wall.material.wireframe = true;

    console.log(wall.geometry.attributes.position);

    wall.geometry.computeBoundingBox();
    console.log(wall.geometry);

    testWallCross();
  }

  move({ point }: { point: PointWall }) {
    if (point.userInfo.wall.length < 1) return;

    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let side = 0;
      if (walls[i].userInfo.point[1] === point) side = 3;

      let v1 = new THREE.Vector3(walls[i].userInfo.geom.v[0 + side].x, point.position.y, -walls[i].userInfo.geom.v[0 + side].y);
      let v2 = new THREE.Vector3(walls[i].userInfo.geom.v[1 + side].x, point.position.y, -walls[i].userInfo.geom.v[1 + side].y);
      let v3 = new THREE.Vector3(walls[i].userInfo.geom.v[2 + side].x, point.position.y, -walls[i].userInfo.geom.v[2 + side].y);

      let point2 = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];

      let dir = new THREE.Vector3().subVectors(point.position, point2.position).normalize();
      let pos = new THREE.Vector3().addScaledVector(dir, 0.5);

      helperCornersWall.showLine({ id: 0 + i * 3, v: [v1, v1.clone().add(pos)] });
      helperCornersWall.showLine({ id: 1 + i * 3, v: [point.position, point.position.clone().add(pos)] });
      helperCornersWall.showLine({ id: 2 + i * 3, v: [v3, v3.clone().add(pos)] });

      console.log(v2, point.position);
    }
  }
}

export let cornersWall = new CornersWall();

class HelperCornersWall {
  arr1: THREE.Line[] = [];
  mat = [
    new THREE.LineBasicMaterial({ color: 0x0000ff, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0x0000ff, depthTest: false, transparent: true }),
  ];

  crLine({ id }: { id: number }) {
    let geometry = new THREE.BufferGeometry();
    let line = new THREE.Line(geometry, this.mat[id % 3]);
    console.log(id % 3);
    line.renderOrder = 1;
    scene.add(line);

    return line;
  }

  upGeomLine({ line, v }: { line: THREE.Line; v: THREE.Vector3[] }) {
    line.geometry.dispose();
    let geometry = new THREE.BufferGeometry().setFromPoints(v);
    line.geometry = geometry;
  }

  showLine({ id, v }: { id: number; v: THREE.Vector3[] }) {
    if (this.arr1[id] === undefined) this.arr1[id] = this.crLine({ id });

    this.upGeomLine({ line: this.arr1[id], v });

    camOrbit.render();
  }
}

let helperCornersWall = new HelperCornersWall();

function testWallCross() {
  let arrP_1 = [new THREE.Vector3(-1.2, 0, 0.3), new THREE.Vector3(1.2, 0, -0.7)];

  {
    let geometry = new THREE.BufferGeometry().setFromPoints(arrP_1);
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    scene.add(line);
  }

  let arrP_2 = [new THREE.Vector3(-0.6, 0, 1.1), new THREE.Vector3(0.6, 0, 2.6)];

  {
    let geometry = new THREE.BufferGeometry().setFromPoints(arrP_2);
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    scene.add(line);
  }

  let point = custMath.spPoint(arrP_1[0], arrP_1[1], arrP_2[0]);
  let cross = custMath.calScal(arrP_1[0], arrP_1[1], point);

  if (cross) {
    let geometry = new THREE.BufferGeometry().setFromPoints([point, arrP_2[0]]);
    let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(line);

    console.log(point);
  }

  camOrbit.render();
}

class CustMath {
  // проекция точки(С) на прямую (A,B)
  spPoint(A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3) {
    let x1 = A.x;
    let y1 = A.z;
    let x2 = B.x;
    let y2 = B.z;
    let x3 = C.x;
    let y3 = C.z;

    let px = x2 - x1;
    let py = y2 - y1;
    let dAB = px * px + py * py;

    let u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    let x = x1 + u * px,
      z = y1 + u * py;

    return new THREE.Vector3(x, 0, z);
  }

  // опредяляем, надодится точка C за пределами отрезка АВ или нет
  calScal(A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3) {
    let AB_1 = { x: B.x - A.x, y: B.z - A.z };
    let CD_1 = { x: C.x - A.x, y: C.z - A.z };
    let r1 = AB_1.x * CD_1.x + AB_1.y * CD_1.y; // скалярное произведение векторов

    let AB_2 = { x: A.x - B.x, y: A.z - B.z };
    let CD_2 = { x: C.x - B.x, y: C.z - B.z };
    let r2 = AB_2.x * CD_2.x + AB_2.y * CD_2.y;

    let cross = r1 < 0 || r2 < 0 ? false : true; // если true , то точка D находится на отрезке AB

    return cross;
  }
}

let custMath = new CustMath();
