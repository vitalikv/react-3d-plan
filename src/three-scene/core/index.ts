import * as THREE from 'three';
import { scene, renderer } from 'three-scene/index';

// удаление значения из массива
export function deleteValueFromArrya({ arr, obj }: { arr: THREE.Mesh[]; obj: THREE.Mesh }) {
  for (var i = arr.length - 1; i > -1; i--) {
    if (arr[i] === obj) {
      arr.splice(i, 1);
      break;
    }
  }
}

// function deleteValueFromArrya({arr, obj})
// {
// 	let n = arr.indexOf(obj);
// 	if (n > -1) arr.splice(n, 1);
// }

export function crPlaneMath(): THREE.Mesh {
  let geometry = new THREE.PlaneGeometry(10000, 10000);
  let material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    visible: false,
  });

  let planeMath = new THREE.Mesh(geometry, material);
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(planeMath);

  return planeMath;
}

export function testInfoMemory() {
  console.log(renderer.info.memory);
}
