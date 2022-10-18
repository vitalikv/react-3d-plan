import * as THREE from 'three';
import { level } from 'three-scene/index';
import { TLevelItem } from 'three-scene/plan/level/index';
import { PointWall, setIdWallPoint } from 'three-scene/plan/point/point';
import { Wall, setIdWall } from 'three-scene/plan/wall/index';
import { IFileJSON } from 'three-scene/save-load/interface';
import { testInfoMemory } from 'three-scene/core/index';

export async function loadLocalFile() {
  let url = 'http://react/react-3d-plan/php/loadLocal.php';

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    let data: IFileJSON = await response.json();
    parseFile({ data });
  } catch (err) {
    console.log(err);
  }
}

function parseFile({ data }: { data: IFileJSON }) {
  level.upDataLevel({ data: parseArrLevel(data) });

  for (let i = 0; i < data.level.length; i++) {
    level.changeLevelAct({ id: i });

    let item = data.level[i];

    for (let i2 = 0; i2 < item.wall.length; i2++) {
      let point1 = findPointWall({ idLevel: i, idPoint: item.wall[i2].point[0].id });
      if (!point1) {
        let a = item.wall[i2].point[0].pos;
        let pos1 = new THREE.Vector3(a.x, a.y, a.z);
        point1 = new PointWall({ id: item.wall[i2].point[0].id, pos: pos1 });
      }

      let point2 = findPointWall({ idLevel: i, idPoint: item.wall[i2].point[1].id });
      if (!point2) {
        let b = item.wall[i2].point[1].pos;
        let pos2 = new THREE.Vector3(b.x, b.y, b.z);
        point2 = new PointWall({ id: item.wall[i2].point[1].id, pos: pos2 });
      }

      new Wall({ id: item.wall[i2].id, p1: point1, p2: point2 });
    }
  }

  setMaxIdPoint();
  setMaxIdWall();

  function setMaxIdPoint() {
    let arr: number[] = [];
    for (let i = 0; i < level.levels.length; i++) {
      level.levels[i].p.forEach((p) => arr.push(p.userInfo.id));
    }

    let n = 0;
    if (arr.length > 0) {
      n = Math.max(...arr);
    }

    setIdWallPoint(n + 1);
  }

  function setMaxIdWall() {
    let arr: number[] = [];
    for (let i = 0; i < level.levels.length; i++) {
      level.levels[i].w.forEach((w) => arr.push(w.userInfo.id));
    }

    let n = 0;
    if (arr.length > 0) {
      n = Math.max(...arr);
    }

    setIdWall(n + 1);
  }

  level.changeLevelAct({ id: 0 });

  console.log('data', data);
  console.log('level', level);
}

function findPointWall({ idLevel, idPoint }: { idLevel: number; idPoint: number }) {
  return level.levels[idLevel].p.find((p) => p.userInfo.id === idPoint);
}

function parseArrLevel(data: IFileJSON) {
  let data2: TLevelItem[] = [];

  for (let i = 0; i < data.level.length; i++) {
    data2[i] = {} as any;
    data2[i].name = data.level[i].name + ' test';
    data2[i].h = data.level[i].h;
    data2[i].p = [];
    data2[i].w = [];
  }

  return data2;
}
