import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { PointWall } from 'three-scene/plan/point/point';
import { testInfoMemory } from 'three-scene/core/index';
import { outlinePass } from 'three-scene/core/composer-render';
import { level } from 'three-scene/index';

//export let walls: Wall[] = [];

let matDefault = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, wireframe: false });

let idWall = 1;

export function setIdWall(id: number) {
  idWall = id;
}

interface UserInfo {
  id: number;
  readonly tag: string;
  readonly wall: boolean;
  point: PointWall[];
  h: number;
}

export class Wall extends THREE.Mesh {
  userInfo: UserInfo = {
    id: 0,
    tag: 'wall',
    wall: true,
    point: [],
    h: 0,
  };

  constructor({ id, p1, p2 }: { id?: number; p1: PointWall; p2: PointWall }) {
    super(new THREE.BufferGeometry(), matDefault);

    this.initWall({ id, p1, p2 });
  }

  protected initWall({ id, p1, p2, h }: { id?: number; p1: PointWall; p2: PointWall; h?: number }) {
    if (!id) {
      id = idWall;
      setIdWall(idWall + 1);
    }
    this.userInfo.id = id;
    this.userInfo.point = [p1, p2];

    this.userInfo.point.forEach((point) => {
      point.addWall({ wall: this });
    });

    if (!h) h = level.getHeight();
    this.userInfo.h = h;

    this.updateGeomWall({ h });

    scene.add(this);

    level.addWall({ wall: this });

    this.render();
  }

  addPoint({ point }: { point: PointWall }) {
    this.userInfo.point.push(point);
  }

  delPoint({ point }: { point: PointWall }) {
    this.userInfo.point = this.userInfo.point.filter((o) => o !== point);
  }

  updateGeomWall({ h }: { h?: number } = {}) {
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

    if (!h) h = this.userInfo.h;
    let shape = new THREE.Shape(arr);
    let geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth: h });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, p1.position.y, 0);

    this.geometry.dispose();
    this.geometry = geometry;
  }

  click({ pos }: { pos: THREE.Vector3 }) {
    start();
    console.log(this.userInfo);

    outlinePass.selectedObjects = [this];
    this.render();

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

  // удаляем только стену (без точек)
  delete() {
    testInfoMemory();

    level.delWall({ wall: this });

    this.userInfo.point = [];
    this.geometry.dispose();
    scene.remove(this);
    this.render();

    testInfoMemory();
  }

  // удаляем стену и очищаем инфу в точках об этой стене
  deleteWallPoint() {
    outlinePass.selectedObjects = [];
    this.userInfo.point.forEach((point) => {
      point.delWall({ wall: this });
      if (point.userInfo.wall.length === 0) point.delete();
    });

    this.delete();
  }

  protected render() {
    camOrbit.render();
  }
}
