import * as THREE from 'three';
import { scene, camOrbit } from '../../index';

let matDefault: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  color: 0x222222,
  depthTest: false,
  transparent: true,
  wireframe: false,
});

let matActive: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  wireframe: false,
});

let geomPoint = geometryPoint();

function geometryPoint(): THREE.BufferGeometry {
  let geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 18);

  let attrP: any = geometry.getAttribute('position');

  for (let i = 0; i < attrP.array.length; i += 3) {
    attrP.array[i + 0] *= 0.5; // x
    attrP.array[i + 2] *= 0.5; // z

    let y = attrP.array[i + 1];
    if (y < 0) {
      attrP.array[i + 1] = 0;
    }
  }

  geometry.attributes.position.needsUpdate = true;

  geometry.userData.attrP = geometry.getAttribute('position').clone();

  return geometry;
}

export class PointWall extends THREE.Mesh {
  constructor({ pos }: { pos: THREE.Vector3 }) {
    super(geomPoint, matDefault);

    this.initObj();

    this.position.copy(pos);
    this.render();
  }

  initObj({ id }: { id?: number } = {}) {
    this.userData.tag = 'pointWall';
    this.userData.pointWall = true;
    this.userData.id = id ? id : 0;

    scene.add(this);
  }

  render() {
    camOrbit.render();
  }
}
