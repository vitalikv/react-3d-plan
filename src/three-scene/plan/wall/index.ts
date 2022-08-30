import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from 'three-scene/plan/point/point';
import { testInfoMemory } from 'three-scene/core/index';
import { outlinePass } from 'three-scene/core/composer-render';

export let walls: Wall[] = [];

let matDefault = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, wireframe: false });

let idWall = 1;

interface UserInfo {
  id: number;
  readonly tag: string;
  readonly wall: boolean;
  point: PointWall[];
}

export class Wall extends THREE.Mesh {
  userInfo: UserInfo = {
    id: 0,
    tag: 'wall',
    wall: true,
    point: [],
  };

  constructor({ p1, p2 }: { p1: PointWall; p2: PointWall }) {
    super(new THREE.BufferGeometry(), matDefault);

    this.initWall({ p1, p2 });
  }

  protected initWall({ p1, p2, id }: { p1: PointWall; p2: PointWall; id?: number }) {
    if (!id) {
      id = idWall;
      idWall++;
    }
    this.userInfo.id = id;
    this.userInfo.point = [p1, p2];

    this.userInfo.point.forEach((point) => {
      point.addWall({ wall: this });
    });

    this.updateGeomWall();

    scene.add(this);

    walls.push(this);

    this.render();
  }

  addPoint({ point }: { point: PointWall }) {
    this.userInfo.point.push(point);
  }

  delPoint({ point }: { point: PointWall }) {
    this.userInfo.point = this.userInfo.point.filter((o) => o !== point);
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

  click({ pos }: { pos: THREE.Vector3 }) {
    start();
    console.log(this.userInfo);

    outlinePass.selectedObjects = [this];

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
    outlinePass.selectedObjects = [];
    mouseEv.clear();

    testInfoMemory();
    console.log(walls.length);

    walls = walls.filter((o) => o !== this);

    this.userInfo.point = [];
    this.geometry.dispose();
    scene.remove(this);
    this.render();

    testInfoMemory();
    console.log(walls.length);
  }

  protected render() {
    camOrbit.render();
  }
}
