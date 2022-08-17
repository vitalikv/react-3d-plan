import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath } from '../../index';
import { rayIntersect } from '../../core/rayhit';
import { deleteValueFromArrya } from '../../core/index';

export let points: PointWall[] = [];

let matDefault = new THREE.MeshStandardMaterial({
  color: 0x222222,
  depthTest: false,
  transparent: true,
  wireframe: false,
});

let matActive = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  wireframe: false,
});

let geomPoint = geometryPoint();

function geometryPoint(): THREE.BufferGeometry {
  let geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 18);

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

    points.push(this);
  }

  click({ pos }: { pos: THREE.Vector3 }) {
    start();

    function start() {
      planeMath.position.y = pos.y;
      planeMath.rotation.set(-Math.PI / 2, 0, 0);
      planeMath.updateMatrixWorld();

      camOrbit.stopMove = true;
      mouseEv.stop = true;
    }

    canvas.onmousemove = (event) => {
      let intersects = rayIntersect(event, planeMath, 'one');
      if (intersects.length === 0) return;

      pos = intersects[0].point.clone().sub(pos);

      this.position.add(pos);

      pos = intersects[0].point;

      this.render();
    };

    canvas.onmouseup = () => {
      canvas.onmousemove = null;
      canvas.onmouseup = null;

      camOrbit.stopMove = false;
      mouseEv.stop = false;

      this.render();
    };
  }

  delete() {
    deleteValueFromArrya({ arr: points, obj: this });
    scene.remove(this);
    this.render();
  }

  render() {
    camOrbit.render();
  }
}
