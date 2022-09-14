import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

export function changeLeval() {
  console.log(7777);
}

let arr = [
  { name: 'level-1', h: { y1: 0, y2: 2.7 } },
  { name: 'level-2', h: { y1: 2.7, y2: 5.4 } },
  { name: 'level-3', h: { y1: 5.4, y2: 8.1 } },
];

export class Level {
  actId = 0;
  levels = [{ name: '', h: { y1: 0, y2: 0 }, p: [PointWall], w: [Wall] }];

  constructor({ arr }: { arr: any }) {
    this.actId = 0;

    this.initLevel({ arr });
  }

  initLevel({ arr }: { arr: any }) {
    for (let i = 0; i < arr.length; i++) {
      this.levels[i] = { name: arr[i].name, h: { y1: arr[i].h.y1, y2: arr[i].h.y2 }, p: [], w: [] };
      console.log(this.levels[i]);
    }
  }
}

new Level({ arr });
