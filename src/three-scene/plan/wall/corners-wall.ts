import * as THREE from 'three';
import { scene, camOrbit } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

class CornersWall {
  move({ point }: { point: PointWall }) {
    helperCornersWall.active({ enabled: false, countLine: 0, clickPoint: point }); //  enabled: true - включить показ линий-помощников

    let arrP = this.getPoint(point);

    let walls2 = this.getWall(arrP); // массив стены у которых будут меняться углы

    for (let i = 0; i < walls2.length; i++) this.defaultV(walls2[i].w, walls2[i].idP); // сбрасываем точки (userInfo.geom.v) стен до прямой стены (без углов)

    for (let i = 0; i < arrP.length; i++) this.calcAngle(arrP[i]); // точки у стен получают углы

    for (let i = 0; i < walls2.length; i++) this.updateGeomWall({ wall: walls2[i].w }); // создаем стены с новыми точками

    camOrbit.render();
  }

  // получаем массив всех соседний точек + исходная точка
  getPoint(point: PointWall) {
    let arrP = [point]; // массив точек (выбранная и соседние)
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let p = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];
      arrP.push(p); // добавляем в массив соседние точки
    }

    return arrP;
  }

  // массив стен у которых будут меняться углы и значение idP - указывает с 2 сторон будут меняться углы или с одной
  getWall(arrP: PointWall[]) {
    // idP - 0 и 1 - углы у стены будут только с одной стороны в начале или конце, 2 - есть обе точки (то есть углы у стены будут меняться с 2 сторон)
    let walls2: { w: Wall; idP: number }[] = [];

    // добавляем в массив стены, у которых есть точки из массива arrP
    for (let i = 0; i < arrP.length; i++) {
      let arrW = arrP[i].userInfo.wall;

      for (let i2 = 0; i2 < arrW.length; i2++) {
        let id = walls2.findIndex((item) => item.w === arrW[i2]);

        if (id < 0) {
          let idP = arrW[i2].userInfo.point[0] === arrP[i] ? 0 : 1;
          walls2.push({ w: arrW[i2], idP });
        } else {
          walls2[id].idP = 2;
        }
      }
    }

    return walls2;
  }

  // сбрасываем точки (userInfo.geom.v) стен до прямой стены (без углов), idP - с 1-ой или 2-х сторон
  defaultV(wall: Wall, idP: number) {
    let [p1, p2] = wall.userInfo.point;
    let width = wall.userInfo.width / 2;

    let dir = new THREE.Vector2(p1.position.z - p2.position.z, p1.position.x - p2.position.x).normalize(); // перпендикуляр
    let offsetL = new THREE.Vector2(dir.x * -width, dir.y * -width);
    let offsetR = new THREE.Vector2(dir.x * width, dir.y * width);

    let arr = wall.userInfo.geom.v;

    if (idP === 0 || idP === 2) {
      arr[0] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetR);
      arr[1] = new THREE.Vector2(p1.position.x, -p1.position.z + 0);
      arr[2] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetL);
    }

    if (idP === 1 || idP === 2) {
      arr[3] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetL);
      arr[4] = new THREE.Vector2(p2.position.x, -p2.position.z + 0);
      arr[5] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetR);
    }

    wall.userInfo.geom.v = arr;
  }

  // если стены перескаются и образуют угол, то обновляем точки стены (userInfo.geom.v)
  calcAngle(point: PointWall) {
    if (point.userInfo.wall.length < 2) return;

    let arr = [];
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let order = 0; // начало стены
      if (walls[i].userInfo.point[1] === point) order = 3; // конец стены

      let point2 = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];
      let posSub = new THREE.Vector3().subVectors(point.position, point2.position);

      let v1 = new THREE.Vector3(walls[i].userInfo.geom.v[0 + order].x, point.position.y, -walls[i].userInfo.geom.v[0 + order].y); // (сторона А)
      let v3 = new THREE.Vector3(walls[i].userInfo.geom.v[2 + order].x, point.position.y, -walls[i].userInfo.geom.v[2 + order].y); // (сторона Б)

      v1.sub(posSub);
      v3.sub(posSub);

      let dir = posSub.clone().normalize();
      let pos = new THREE.Vector3().addScaledVector(dir, 100);

      helperCornersWall.calcLine({ point, v1, v3, pos });

      let angel = Math.atan2(dir.x, dir.z);
      if (angel < 0) angel += Math.PI * 2;

      arr[i] = {
        wall: walls[i],
        line1: { p1: v1, p2: v1.clone().add(pos) }, // направление линии (сторона А)
        line2: { p1: v3, p2: v3.clone().add(pos) }, // направление линии (сторона Б)
        sideA: 0 + order,
        sideB: 2 + order,
        angel: angel,
      };
    }

    // сортируем стены по углу поворота
    arr.sort(function (a, b) {
      return b.angel - a.angel;
    });

    // находим точки пересечения линий/сторон стен
    for (let i = 0; i < arr.length; i++) {
      let n = i === arr.length - 1 ? 0 : i + 1;

      let cross = this.intersect(arr[i].line1, arr[n].line2);
      if (cross) {
        arr[i].wall.userInfo.geom.v[arr[i].sideA] = new THREE.Vector2(cross.x, -cross.y);
        arr[n].wall.userInfo.geom.v[arr[n].sideB] = new THREE.Vector2(cross.x, -cross.y);
      }
    }
  }

  // вычисление точки пересечения двух отрезков
  // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
  // Determine the intersection point of two line segments
  // Return FALSE if the lines don't intersect
  intersect(line1: { p1: THREE.Vector3; p2: THREE.Vector3 }, line2: { p1: THREE.Vector3; p2: THREE.Vector3 }) {
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

  // обновляем geometry у стены, с учетом новых точек или старых (если небыло угла)
  updateGeomWall({ wall }: { wall: Wall }) {
    let [p1, p2] = wall.userInfo.point;
    let h = wall.userInfo.h;

    let shape = new THREE.Shape(wall.userInfo.geom.v);
    let geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: h });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, p1.position.y, 0);

    wall.geometry.dispose();
    wall.geometry = geometry;
  }
}

export let cornersWall = new CornersWall();

// класс помощник, для отображения линий
class HelperCornersWall {
  enabled = true;
  countLine = 0;
  clickPoint: PointWall | null = null;
  arr1: THREE.Line[] = [];

  mat = [
    new THREE.LineBasicMaterial({ color: 0x0000ff, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false, transparent: true }),
    new THREE.LineBasicMaterial({ color: 0x00ff00, depthTest: false, transparent: true }),
  ];

  active({ enabled, countLine, clickPoint }: { enabled: boolean; countLine: number; clickPoint: PointWall }) {
    this.enabled = enabled;
    this.countLine = countLine;
    this.clickPoint = clickPoint;
  }

  calcLine({ point, v1, v3, pos }: { point: PointWall; v1: THREE.Vector3; v3: THREE.Vector3; pos: THREE.Vector3 }) {
    if (this.enabled && this.clickPoint === point) {
      this.showLine({ id: 0 + this.countLine * 3, v: [v1, v1.clone().add(pos)] });
      this.showLine({ id: 1 + this.countLine * 3, v: [point.position, point.position.clone().add(pos)] });
      this.showLine({ id: 2 + this.countLine * 3, v: [v3, v3.clone().add(pos)] });
      this.countLine++;
      if (this.countLine > 1) this.countLine = 0; // по 3 линии для 2 стен
    }
  }

  crLine({ id }: { id: number }) {
    let geometry = new THREE.BufferGeometry();
    let line = new THREE.Line(geometry, this.mat[id % 3]);
    console.log(id, id % 3);
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
