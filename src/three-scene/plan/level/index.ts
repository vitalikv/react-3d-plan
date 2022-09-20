import { store } from 'ui/store/store';
import { init, select } from 'ui/store/slice/slice-level-list';
import { useAppDispatch, useAppSelector } from 'ui/store/hook';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

type LevelItem = { name: string; h: { y1: number; y2: number }; p: PointWall[]; w: Wall[] };

export class Level {
  actId = 0;
  levels: LevelItem[];

  constructor() {
    this.actId = 0;
    this.levels = [];

    this.initLevel();
    console.log('class Level');
  }

  protected initLevel() {
    let arr = [
      { name: 'level-1', h: { y1: 0, y2: 2.7 }, p: [], w: [] },
      { name: 'level-2', h: { y1: 2.7, y2: 5.4 }, p: [], w: [] },
      { name: 'level-3', h: { y1: 5.4, y2: 8.1 }, p: [], w: [] },
    ];

    this.levels = arr;
    this.actId = 0;
    //this.initReactLevelList();
  }

  initReactLevelList() {
    let arr = this.levels.map((i) => {
      return { act: false, name: i.name };
    });

    arr[this.actId].act = true;

    //const dispatch = useAppDispatch();
    store.dispatch(init(arr));
  }

  changeLevelAct({ id }: { id: number }) {
    this.actId = id;
    console.log('this.actId', this.actId);
  }

  getArrObjs() {
    return [...this.levels[this.actId].p, ...this.levels[this.actId].w];
  }

  getArrWall() {
    return this.levels[this.actId].w;
  }

  getArrPointWall() {
    return this.levels[this.actId].p;
  }

  addPoint({ point }: { point: PointWall }) {
    this.levels[this.actId].p.push(point);
  }

  delPoint({ point }: { point: PointWall }) {
    //this.levels[this.actId].p = this.levels[this.actId].p.filter((o) => o !== point);
    let n = this.levels[this.actId].p.indexOf(point);
    if (n > -1) this.levels[this.actId].p.splice(n, 1);
  }

  addWall({ wall }: { wall: Wall }) {
    this.levels[this.actId].w.push(wall);
  }

  delWall({ wall }: { wall: Wall }) {
    //this.levels[this.actId].w = this.levels[this.actId].w.filter((o) => o !== wall);
    let n = this.levels[this.actId].w.indexOf(wall);
    if (n > -1) this.levels[this.actId].w.splice(n, 1);
  }
}
