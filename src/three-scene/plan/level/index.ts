import { store } from 'ui/store/store';
import { init, select } from 'ui/store/slice/slice-level-list';
import { useAppDispatch, useAppSelector } from 'ui/store/hook';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

type LevelItem = { name: string; h: { y1: number; y2: number }; p: PointWall[]; w: Wall[] };

class Level {
  actId = 0;
  levels: LevelItem[];

  constructor() {
    this.levels = [];

    console.log('class Level');
  }

  initLevel() {
    let arr = [
      { name: 'level-1', h: { y1: 0, y2: 2.7 }, p: [], w: [] },
      { name: 'level-2', h: { y1: 2.7, y2: 5.4 }, p: [], w: [] },
      { name: 'level-3', h: { y1: 5.4, y2: 8.1 }, p: [], w: [] },
    ];

    this.levels = arr;
    this.actId = 0;
    this.initReactLevelList({ arr, actId: this.actId });
  }

  initReactLevelList({ arr, actId }: { arr: LevelItem[]; actId: number }) {
    let arr2 = arr.map((i) => {
      return { act: false, name: i.name };
    });

    arr2[actId].act = true;

    //const dispatch = useAppDispatch();
    store.dispatch(init(arr2));
  }

  changeLevelAct({ id }: { id: number }) {
    this.actId = id;
    console.log('this.actId', this.actId);
  }
}

export const level = new Level();
