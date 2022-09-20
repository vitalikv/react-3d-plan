//import { initThreejs } from 'threejs';
import { level } from 'three-scene/index';

class ApiUiToThree {
  readyUi() {
    console.log('ready react');
    //initThreejs();

    this.loadLevel();
  }

  loadLevel() {
    level.initReactLevelList();
  }
}

export const apiUiToThree = new ApiUiToThree();
