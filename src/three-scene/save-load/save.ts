import * as THREE from 'three';
import { level } from 'three-scene/index';
import { IFileJSON } from 'three-scene/save-load/interface';

export function saveLocalFile2() {
  let json = { save: true, test: 'da' };
  let data = JSON.stringify(json);

  let csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(data);

  let link = document.createElement('a');
  document.body.appendChild(link);
  link.href = csvData;
  link.target = '_blank';
  link.download = 'file.json';
  link.click();
  document.body.removeChild(link);
}

export async function saveLocalFile() {
  let json = { save: true, test: 'da' };
  let str = JSON.stringify(saveScene());

  let url = 'http://react/react-3d-plan/php/saveLocal.php';

  let response = await fetch(url, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(str),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
  let data = await response.json();

  console.log(data);
}

function saveScene() {
  let arr = level.levels;

  let json: IFileJSON = { level: [] };

  for (let i = 0; i < arr.length; i++) {
    json.level[i] = {} as any;

    json.level[i].name = arr[i].name;
    json.level[i].h = arr[i].h;

    json.level[i].point = [];
    json.level[i].wall = [];

    for (let i2 = 0; i2 < arr[i].p.length; i2++) {
      json.level[i].point[i2] = { id: 0, pos: new THREE.Vector3() };

      json.level[i].point[i2].id = arr[i].p[i2].userInfo.id;
      json.level[i].point[i2].pos = arr[i].p[i2].position;

      //json.level[i].point[i2].joinP = arr[i].p[i2].userData.point.joinP.map((o) => o.userData.id);
    }

    for (let i2 = 0; i2 < arr[i].w.length; i2++) {
      json.level[i].wall![i2] = {} as any;

      json.level[i].wall![i2].id = arr[i].w[i2].userInfo.id;

      let p: { id: number; pos: THREE.Vector3 }[] = [];
      p[0] = { id: arr[i].w[i2].userInfo.point[0].userInfo.id, pos: arr[i].w[i2].userInfo.point[0].position };
      p[1] = { id: arr[i].w[i2].userInfo.point[1].userInfo.id, pos: arr[i].w[i2].userInfo.point[1].position };

      json.level[i].wall![i2].point = p;
    }
  }

  console.log(json);
  return json;
}
