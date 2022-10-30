import * as THREE from 'three';
import { Wall } from 'three-scene/plan/wall/index';

class Clipping {
  plane: THREE.Plane = new THREE.Plane();

  init({ renderer }: { renderer: THREE.WebGLRenderer }) {
    console.log('localClippingEnabled');
    renderer.localClippingEnabled = true;

    this.plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.8);
  }

  setObjClipping({ obj }: { obj: Wall }) {
    if (!Array.isArray(obj.material)) obj.material.clippingPlanes = [this.plane];
  }
}

export let clipping = new Clipping();
