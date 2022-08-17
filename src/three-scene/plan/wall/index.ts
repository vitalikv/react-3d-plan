import * as THREE from 'three';
import { scene, camOrbit } from '../../index';
import { PointWall } from '../point/point';

let matDefault = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, wireframe: false });

export class Wall extends THREE.Mesh {
  constructor({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    super(new THREE.BufferGeometry(), matDefault);

    this.initWall({ p1, p2 });
  }

  initWall({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    let geometry = this.updateGeomWall({ p1, p2 });
    this.geometry.dispose();
    this.geometry = geometry;

    scene.add(this);
    this.render();
  }

  updateGeomWall({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    let dir = new THREE.Vector2(p1.position.z - p2.position.z, p1.position.x - p2.position.x).normalize(); // перпендикуляр
    let width = 0.02;
    let offsetL = new THREE.Vector2(dir.x * -width, dir.y * -width);
    let offsetR = new THREE.Vector2(dir.x * width, dir.y * width);

    let arr = [];

    arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetR);
    arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z + 0);
    arr[arr.length] = new THREE.Vector2(p1.position.x, -p1.position.z).add(offsetL);
    arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetL);
    arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z + 0);
    arr[arr.length] = new THREE.Vector2(p2.position.x, -p2.position.z).add(offsetR);

    let shape = new THREE.Shape(arr);
    let geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: 3 });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, p1.position.y, 0);

    return geometry;
  }

  render() {
    camOrbit.render();
  }
}
