import * as THREE from 'three';

// удаление значения из массива
export function deleteValueFromArrya({ arr, obj }: { arr: THREE.Mesh[]; obj: THREE.Mesh }) {
  for (var i = arr.length - 1; i > -1; i--) {
    if (arr[i] === obj) {
      arr.splice(i, 1);
      break;
    }
  }
}
