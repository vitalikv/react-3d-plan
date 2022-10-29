import * as THREE from 'three';
import { scene, camOrbit, level } from 'three-scene/index';
import { PointWall } from 'three-scene/plan/point/point';

export class LineAxis {
  lX: THREE.Line | null = null;
  lY: THREE.Line | null = null;

  constructor() {
    this.init();

    this.render();
  }

  protected init() {
    let geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1000, 0, 0), new THREE.Vector3(1000, 0, 0)]);
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    this.lX = new THREE.Line(new THREE.BufferGeometry(), material);
    scene.add(this.lX);

    this.lY = new THREE.Line(new THREE.BufferGeometry(), material);
    scene.add(this.lY);
  }

  visible(value: boolean) {
    this.lX!.visible = value;
    this.lY!.visible = value;
  }

  setLine({ point }: { point: PointWall }) {
    let newPos = null;
    let pos = point.position.clone();
    let points = level.getArrPointWall();

    let posAxis: { horiz: THREE.Vector3 | null; vert: THREE.Vector3 | null } = { horiz: null, vert: null };

    for (let i = 0; i < points.length; i++) {
      if (points[i] === point) continue;

      let pHoriz = this.spPoint(points[i].position, new THREE.Vector3(1000, 0, points[i].position.z), pos);
      let pVert = this.spPoint(points[i].position, new THREE.Vector3(points[i].position.x, 0, 1000), pos);

      let horiz = Math.abs(pos.z - pHoriz.z);
      let vert = Math.abs(pos.x - pVert.x);

      if (horiz < 0.06 / camOrbit.cam2D.zoom) posAxis.horiz = pHoriz;
      if (vert < 0.06 / camOrbit.cam2D.zoom) posAxis.vert = pVert;

      if (posAxis.horiz && posAxis.vert) break;
    }

    //if(posAxis.horiz || posAxis.vert) { newPos = pos.clone(); }
    newPos = pos.clone();

    if (posAxis.horiz) {
      let p1 = new THREE.Vector3(-1000, 0, posAxis.horiz.z);
      let p2 = new THREE.Vector3(1000, 0, posAxis.horiz.z);

      let geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);

      this.lX!.geometry.dispose();
      this.lX!.geometry = geometry;
      this.lX!.visible = true;

      newPos.z = posAxis.horiz.z;
    }

    if (posAxis.vert) {
      let p1 = new THREE.Vector3(posAxis.vert.x, 0, -1000);
      let p2 = new THREE.Vector3(posAxis.vert.x, 0, 1000);

      let geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);

      this.lY!.geometry.dispose();
      this.lY!.geometry = geometry;
      this.lY!.visible = true;

      newPos.x = posAxis.vert.x;
    }

    return newPos;
  }

  // проекция точки(С) на прямую (A,B)
  protected spPoint(A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3) {
    let x1 = A.x;
    let y1 = A.z;
    let x2 = B.x;
    let y2 = B.z;
    let x3 = C.x;
    let y3 = C.z;

    let px = x2 - x1;
    let py = y2 - y1;
    let dAB = px * px + py * py;

    let u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    let x = x1 + u * px,
      z = y1 + u * py;

    return new THREE.Vector3(x, 0, z);
  }

  protected render() {
    camOrbit.render();
  }
}
