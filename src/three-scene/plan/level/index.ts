import * as THREE from 'three';
import { scene, camOrbit, mouseEv, uimain } from 'three-scene/index';
import { Wall, setIdWall } from 'three-scene/plan/wall/index';
import { PointWall, setIdWallPoint } from 'three-scene/plan/point/point';

export type TLevelItem = { name: string; h: { y1: number; y2: number }; p: PointWall[]; w: Wall[] };

export class Level {
  private actId: number;
  levels: TLevelItem[];
  grid: THREE.GridHelper;

  constructor({ grid }: { grid: THREE.GridHelper }) {
    this.actId = 0;
    this.levels = [];
    this.grid = grid;

    this.initLevel();
    console.log('class Level');
  }

  private initLevel() {
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

    uimain.rp?.level?.crList({ arr });
  }

  changeLevelAct({ id }: { id: number }) {
    this.actId = id;

    mouseEv.resetSelect();
    this.grid.position.y = this.getPosY1() + 0.002;

    if (camOrbit.activeCam === camOrbit.cam2D) showLevelCam2D({ actId: this.actId, level: this });
    if (camOrbit.activeCam === camOrbit.cam3D) showLevelCam3D({ actId: this.actId, level: this });

    this.render();
    console.log('this.actId', this.actId);
  }

  getPosY1() {
    return this.levels[this.actId].h.y1;
  }

  getHeight() {
    return this.levels[this.actId].h.y2 - this.levels[this.actId].h.y1;
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

  private delObjLevel({ id }: { id: number }) {
    let point = this.levels[id].p;
    this.levels[id].p = [];

    for (let i = 0; i < point.length; i++) {
      point[i].geometry.dispose();
      scene.remove(point[i]);
    }

    let wall = this.levels[id].w;
    this.levels[id].w = [];

    for (let i = 0; i < wall.length; i++) {
      wall[i].geometry.dispose();
      scene.remove(wall[i]);
    }
  }

  private delLevels() {
    for (let i = 0; i < this.levels.length; i++) {
      this.delObjLevel({ id: i });
    }

    setIdWallPoint(1);
    setIdWall(1);

    this.levels = [{ name: 'test', h: { y1: 0, y2: 2.7 }, p: [], w: [] }];
    this.actId = 0;
  }

  upDataLevel({ data }: { data: TLevelItem[] }) {
    this.delLevels();
    this.levels = data;

    this.initReactLevelList();
    this.render();
  }

  switchCamera({ type }: { type: string }) {
    if (type === '2D') showLevelCam2D({ actId: this.actId, level: this });
    if (type === '3D') showLevelCam3D({ actId: this.actId, level: this });
  }

  private render() {
    camOrbit.render();
  }
}

function showLevelCam2D({ actId, level }: { actId: number; level: Level }) {
  for (let i = 0; i < level.levels.length; i++) {
    let visible = false;

    if (i === actId) visible = true;
    if (i === actId - 1) visible = true;

    level.levels[i].p.forEach((p) => (p.visible = visible));
    level.levels[i].w.forEach((w) => (w.visible = visible));
  }
}

function showLevelCam3D({ actId, level }: { actId: number; level: Level }) {
  for (let i = 0; i < level.levels.length; i++) {
    level.levels[i].p.forEach((p) => (p.visible = false));
    level.levels[i].w.forEach((w) => (w.visible = true));
  }
}
