import * as THREE from 'three';
import { scene, camOrbit } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';
import { testInfoMemory } from 'three-scene/core/index';

export let walls: Wall[] = [];

let matDefault = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, wireframe: false });

interface UserInfo {
  id: number;
  readonly tag: string;
  readonly wall: boolean;
  point: [PointWall | null, PointWall | null];
}

export class Wall extends THREE.Mesh {
  userInfo: UserInfo = {
    id: 0,
    tag: 'wall',
    wall: true,
    point: [null, null],
  };

  constructor({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    super(new THREE.BufferGeometry(), matDefault);

    this.initWall({ p1, p2 });
  }

  protected initWall({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    this.userInfo.id = 0;
    this.userInfo.point = [p1, p2];

    this.userInfo.point.forEach((o) => {
      if (o instanceof PointWall) o.addWall({ wall: this });
    });

    this.updateGeomWall();

    scene.add(this);

    walls.push(this);

    this.render();
  }

  updateGeomWall() {
    let [p1, p2] = this.userInfo.point;
    if (!(p1 instanceof PointWall) || !(p2 instanceof PointWall)) return;

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

    this.geometry.dispose();
    this.geometry = geometry;
  }

  delete() {
    testInfoMemory();
    console.log(walls.length);

    walls = walls.filter((o) => o !== this);

    let p = this.userInfo.point;

    this.userInfo.point.forEach((point) => {
      if (point instanceof PointWall) point.delWall({ wall: this });
    });

    this.userInfo.point = [null, null];
    this.geometry.dispose();
    scene.remove(this);
    this.render();

    p.forEach((point) => {
      if (point instanceof PointWall && point.userInfo.wall.length == 0) point.delete();
    });

    testInfoMemory();
    console.log(walls.length);
  }

  protected render() {
    camOrbit.render();
  }
}
