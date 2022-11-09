import * as THREE from 'three';
import { scene, camOrbit } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

let cube: THREE.Mesh | null = null;

class CornersWall {
  move({ point }: { point: PointWall }) {
    let arrP = [point];
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let p = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];
      arrP.push(p);
    }

    let walls2 = [];
    for (let i = 0; i < arrP.length; i++) {
      let arrW = arrP[i].userInfo.wall;

      for (let i2 = 0; i2 < arrW.length; i2++) {
        let exsist = walls.find((w) => w === arrW[i2]);

        if (!exsist) {
          walls2.push(arrW[i2]);
          arrW[i2].updateGeomWall();
        }
      }
    }

    console.log(walls2);

    for (let i = 0; i < arrP.length; i++) this.upLineYY(arrP[i]);

    camOrbit.render();
  }

  upLineYY(point: PointWall) {
    if (point.userInfo.wall.length < 2) return;

    let arr = [];
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let order = 0; // начало стены
      if (walls[i].userInfo.point[1] === point) order = 3; // конец стены

      let v1 = new THREE.Vector3(walls[i].userInfo.geom.v[0 + order].x, point.position.y, -walls[i].userInfo.geom.v[0 + order].y); // (сторона А)
      //let v2 = new THREE.Vector3(walls[i].userInfo.geom.v[1 + order].x, point.position.y, -walls[i].userInfo.geom.v[1 + order].y);
      let v3 = new THREE.Vector3(walls[i].userInfo.geom.v[2 + order].x, point.position.y, -walls[i].userInfo.geom.v[2 + order].y); // (сторона Б)

      let point2 = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];

      let dir = new THREE.Vector3().subVectors(point.position, point2.position).normalize();
      let pos = new THREE.Vector3().addScaledVector(dir, 0.5);
      let pos2 = new THREE.Vector3().addScaledVector(dir, 1);

      helperCornersWall.showLine({ id: 0 + i * 3, v: [v1, v1.clone().add(pos)] });
      helperCornersWall.showLine({ id: 1 + i * 3, v: [point.position, point.position.clone().add(pos)] });
      helperCornersWall.showLine({ id: 2 + i * 3, v: [v3, v3.clone().add(pos)] });

      arr[i] = {
        wall: walls[i],
        line1: { p1: v1, p2: v1.clone().add(pos) }, // направление линии вперед (сторона А)
        line2: { p1: v3, p2: v3.clone().add(pos) }, // направление линии вперед (сторона Б)
        line3: { p1: v1, p2: v1.clone().sub(pos2) }, // направление линии назад (сторона А)
        line4: { p1: v3, p2: v3.clone().sub(pos2) }, // направление линии назад (сторона Б)
        sideA: 0 + order,
        sideB: 2 + order,
      };
    }

    if (arr.length < 2) return;

    let cross = intersect(arr[0].line1, arr[1].line2); // направление линии вперед (сторона А)
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].sideA);
      crossWall(cross, arr[1].wall, arr[1].sideB);
    }

    cross = intersect(arr[0].line2, arr[1].line1); // направление линии вперед (сторона Б)
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].sideB);
      crossWall(cross, arr[1].wall, arr[1].sideA);
    }

    //---- внутренние углы
    cross = intersect(arr[0].line3, arr[1].line4); // направление линии назад (сторона А)
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].sideA);
      crossWall(cross, arr[1].wall, arr[1].sideB);
    }

    cross = intersect(arr[0].line4, arr[1].line3); // направление линии назад (сторона Б)
    if (cross) {
      crossWall(cross, arr[0].wall, arr[0].sideB);
      crossWall(cross, arr[1].wall, arr[1].sideA);
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
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;

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
