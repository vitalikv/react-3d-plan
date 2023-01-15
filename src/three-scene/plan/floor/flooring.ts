import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath, lineAxis, level } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';

interface UserInfo {
  id: number;
  readonly tag: string;
  points: PointWall[];
}

export class Flooring extends THREE.Mesh {
  userInfo: UserInfo = {
    id: 0,
    tag: 'flooring',
    points: [],
  };

  constructor({ pathPoints }: { pathPoints: PointWall[] }) {
    super(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff).setHex(Math.random() * 0xffffff), wireframe: false }));

    this.userInfo.points = pathPoints;
    this.updateGeomFloor();

    if (pathPoints.length > 0) this.position.y = pathPoints[0].position.y;

    scene.add(this);
    this.render();
  }

  updateGeomFloor() {
    this.geometry.dispose();

    let arrP = this.userInfo.points;
    let arr = [];

    for (let i = 0; i < arrP.length - 1; i++) {
      arr[i] = new THREE.Vector2(arrP[i].position.x, arrP[i].position.z);
    }

    let shape = new THREE.Shape(arr);
    let geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: 0.05 });
    geometry.rotateX(Math.PI / 2);

    this.geometry = geometry;

    this.render();
  }

  delete() {
    this.geometry.dispose();
    if (!Array.isArray(this.material)) this.material.dispose();
    scene.remove(this);
  }

  render() {
    camOrbit.render();
  }
}
