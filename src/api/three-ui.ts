//import {} from 'api/three-ui';
import { container } from 'three-scene/index';
import { crBtnSave, crBtnLoad } from 'three-scene/save-load/button';

class ApiThreeToUi {
  readyThree() {
    console.log('start threejs');
    if (container) {
      crBtnSave({ container });
      crBtnLoad({ container });
    }
  }

  startReact() {}
}

export const apiThreeToUi = new ApiThreeToUi();
