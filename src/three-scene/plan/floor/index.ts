import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath, lineAxis, level } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';
import { Flooring } from 'three-scene/plan/floor/flooring';

class Floor {
  //arrFloor: Array<PointWall[]> = [];
  arrFloor: Array<Flooring> = [];

  calc() {
    const arr = level.levels;

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      for (let i2 = 0; i2 < item.p.length; i2++) {
        console.log(i, item.p[i2].userInfo.id, 'item.p.length', item.p.length);
        this.addCheckFloor({ point: item.p[i2] });
      }
    }
  }

  addCheckFloor({ point }: { point: PointWall }) {
    let arrP = this.getPoint(point);

    for (let i = 0; i < arrP.length; i++) {
      let p2 = arrP[i];

      if (p2.userInfo.wall.length < 2) continue;

      let arr = this.getContour({ pathPoint: [point], nextPoint: p2 });

      if (arr.length === 0) continue;
      if (arr[0] !== arr[arr.length - 1]) continue;
      if (this.checkClockWise(arr) <= 0) continue;
      if (this.detectSameZone({ arrP: arr })) continue;

      let arrId = arr.map((o) => o.userInfo.id);
      console.log(arrId);

      let obj = new Flooring({ pathPoints: arr });

      this.arrFloor[this.arrFloor.length] = obj;
    }

    console.log('this.arrFloor', this.arrFloor);
  }

  // получаем массив всех соседних точек
  getPoint(point: PointWall) {
    let arrP = []; // массив соседних точек
    let walls = point.userInfo.wall;

    for (let i = 0; i < walls.length; i++) {
      let p = walls[i].userInfo.point[0] === point ? walls[i].userInfo.point[1] : walls[i].userInfo.point[0];
      arrP.push(p); // добавляем в массив соседние точки
    }

    return arrP;
  }

  // ищем замкнутый контур
  getContour({ pathPoint, nextPoint }: { pathPoint: PointWall[]; nextPoint: PointWall }) {
    let arr = pathPoint;
    let pNew = nextPoint;

    let pPrev = arr[arr.length - 1];
    arr[arr.length] = pNew;

    let arrD = [];
    let dir1 = new THREE.Vector3().subVectors(pNew.position, pPrev.position).normalize();

    let arrP = this.getPoint(pNew);

    for (let i = 0; i < arrP.length; i++) {
      let pNext = arrP[i];

      if (pNext === pPrev) continue;
      if (pNext.userInfo.wall.length < 2) continue;

      let dir2 = new THREE.Vector3().subVectors(pNext.position, pNew.position).normalize();

      let d =
        (pNext.position.x - pPrev.position.x) * (pNew.position.z - pPrev.position.z) -
        (pNext.position.z - pPrev.position.z) * (pNew.position.x - pPrev.position.x);

      let angle = dir1.angleTo(dir2);

      if (d > 0) angle *= -1;
      //console.log(THREE.MathUtils.radToDeg(angle));
      arrD[arrD.length] = { point: pNext, angle: angle };

      if (!this.isNumeric(angle)) {
        return arr;
      }
    }

    if (arrD.length > 0) {
      arrD.sort(function (a, b) {
        return a.angle - b.angle;
      });

      if (arr[0] !== arrD[0].point) {
        arr = this.getContour({ pathPoint: arr, nextPoint: arrD[0].point });
      } else {
        arr[arr.length] = arrD[0].point;
      }
    } else {
      arr = [];
    }

    return arr;
  }

  // проверка: число или нет
  isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  //площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
  checkClockWise(arrP: PointWall[]) {
    let res = 0;
    let n = arrP.length;
    let p1, p2, p3;

    for (let i = 0; i < n; i++) {
      p1 = arrP[i].position;

      if (i === 0) {
        p2 = arrP[n - 1].position;
        p3 = arrP[i + 1].position;
      } else if (i === n - 1) {
        p2 = arrP[i - 1].position;
        p3 = arrP[0].position;
      } else {
        p2 = arrP[i - 1].position;
        p3 = arrP[i + 1].position;
      }

      res += p1.x * (p2.z - p3.z);
    }

    res = res / 2;
    res = Math.round(res * 10) / 10;

    return res;
  }

  // проверяем если зона с такими же точками
  detectSameZone({ arrP }: { arrP: PointWall[] }) {
    let arrFC = this.arrFloor;
    let exsist = false;

    for (let i = 0; i < arrFC.length; i++) {
      let arr = arrFC[i].userInfo.points;

      if (arr.length !== arrP.length) continue;

      let count = 0;

      for (let i2 = 0; i2 < arr.length - 1; i2++) {
        for (let i3 = 0; i3 < arrP.length - 1; i3++) {
          if (arr[i2] === arrP[i3]) {
            count++;
            break;
          }
        }
      }

      if (count === arrP.length - 1) {
        exsist = true;
        break;
      }
    }

    return exsist;
  }
}

export let flooring = new Floor();
