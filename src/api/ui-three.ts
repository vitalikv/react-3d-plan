//import { initThreejs } from 'threejs';
import { level } from 'three-scene/plan/level/index';

class ApiUiToThree {
  readyUi() {
    console.log('ready react');
    //initThreejs();

    this.loadLevel();
  }

  loadLevel() {
    level.initLevel();
  }
}

export const apiUiToThree = new ApiUiToThree();
