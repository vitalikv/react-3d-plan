import * as THREE from 'three';
import { scene, camOrbit } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from '../point/point';

let cube: THREE.Mesh | null = null;

class CornersWall {
  start({ wall }: { wall: Wall }) {
    if (wall.material instanceof THREE.MeshStandardMaterial) wall.material.wireframe = true;

    console.log(wall.geometry.attributes.position);

    wall.geometry.computeBoundingBox();
    console.log(wall.geometry);

    testWallCross();
  }

  move({ point }: { point: PointWall }) {
    if (point.userInfo.wall.length < 2) return;

    let arr = [];
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let order = 0;
      if (walls[i].userInfo.point[1] === point) order = 3;

      let v1 = new THREE.Vector3(walls[i].userInfo.geom.v[0 + order].x, point.position.y, -walls[i].userInfo.geom.v[0 + order].y);
      let v2 = new THREE.Vector3(walls[i].userInfo.geom.v[1 + order].x, point.position.y, -walls[i].userInfo.geom.v[1 + order].y);
      let v3 = new THREE.Vector3(walls[i].userInfo.geom.v[2 + order].x, point.position.y, -walls[i].userInfo.geom.v[2 + order].y);

      let point2 = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];

      let dir = new THREE.Vector3().subVectors(point.position, point2.position).normalize();
      let pos = new THREE.Vector3().addScaledVector(dir, 0.5);

      helperCornersWall.showLine({ id: 0 + i * 3, v: [v1, v1.clone().add(pos)] });
      helperCornersWall.showLine({ id: 1 + i * 3, v: [point.position, point.position.clone().add(pos)] });
      helperCornersWall.showLine({ id: 2 + i * 3, v: [v3, v3.clone().add(pos)] });

      arr[i] = {
        wall: walls[i],
        line1: { p1: v1, p2: v1.clone().add(pos) },
        line2: { p1: v3, p2: v3.clone().add(pos) },
        line3: { p1: v1, p2: v1.clone().sub(pos) },
        line4: { p1: v3, p2: v3.clone().sub(pos) },
        idV: 0 + order,
        idV2: 2 + order,
      };
    }

    let cross = intersect(arr[0].line1, arr[1].line2);
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].idV);
      cross = intersect(arr[1].line2, arr[0].line1);
      crossWall(cross, arr[1].wall, arr[1].idV2);
    }

    cross = intersect(arr[0].line2, arr[1].line1);
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].idV2);
      cross = intersect(arr[1].line1, arr[0].line2);
      crossWall(cross, arr[1].wall, arr[1].idV);
    }

    //---- внутренние углы
    cross = intersect(arr[0].line3, arr[1].line4);
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].idV);
      cross = intersect(arr[1].line4, arr[0].line3);
      crossWall(cross, arr[1].wall, arr[1].idV2);
    }

    cross = intersect(arr[0].line4, arr[1].line3);
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].idV2);
      cross = intersect(arr[1].line3, arr[0].line4);
      crossWall(cross, arr[1].wall, arr[1].idV);
    }
  }
}

function crossWall(cross: boolean | THREE.Vector2, wall: Wall, idV: number) {
  if (!cross) return;
  if (!(cross instanceof THREE.Vector2)) return;

  if (!cube) {
    let material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 1,
      depthTest: false,
    });
    let obj = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), material);
    obj.renderOrder = 2;
    //obj.visible = false;
    scene.add(obj);
    cube = obj;
  }

  cube!.position.set(cross.x, 0, cross.y);

  let v2 = [...wall.userInfo.geom.v];
  v2[idV] = new THREE.Vector2(cross.x, -cross.y);

  updateGeomWall({ wall, v2 });
}

function updateGeomWall({ wall, v2, h, width }: { wall: Wall; v2: THREE.Vector2[]; h?: number; width?: number }) {
  let [p1, p2] = wall.userInfo.point;
  if (!(p1 instanceof PointWall) || !(p2 instanceof PointWall)) return;

  if (!width) width = wall.userInfo.width;
  else wall.userInfo.width = width;

  let dir = new THREE.Vector2(p1.position.z - p2.position.z, p1.position.x - p2.position.x).normalize(); // перпендикуляр
  let offsetL = new THREE.Vector2(dir.x * -width, dir.y * -width);
  let offsetR = new THREE.Vector2(dir.x * width, dir.y * width);

  let arr = v2;

  // arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetR);
  // arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z + 0);
  // arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetL);
  // arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetL);
  // arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z + 0);
  // arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetR);

  if (!h) h = wall.userInfo.h;
  let shape = new THREE.Shape(arr);
  let geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: h });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, p1.position.y, 0);

  wall.geometry.dispose();
  wall.geometry = geometry;

  wall.userInfo.geom.v = arr;
}

export let cornersWall = new CornersWall();

class HelperCornersWall {
  arr1: THREE.Line[] = [];
  mat = [
    new THREE.LineBasicMaterial({ color: 0x0000ff, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0x00ff00, depthTest: false, transparent: true }),
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

// вычисление точки пересечения двух отрезков
// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(line1: { p1: THREE.Vector3; p2: THREE.Vector3 }, line2: { p1: THREE.Vector3; p2: THREE.Vector3 }) {
  let x1 = line1.p1.x;
  let y1 = line1.p1.z;
  let x2 = line1.p2.x;
  let y2 = line1.p2.z;

  let x3 = line2.p1.x;
  let y3 = line2.p1.z;
  let x4 = line2.p2.x;
  let y4 = line2.p2.z;

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) return false;

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return new THREE.Vector2(x, y);
}

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
