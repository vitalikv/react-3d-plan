import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { canvas, scene, camOrbit, planeMath, mouseEv } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { level } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';

export class MyCSG {
  csgObj: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  size = { x: 1, y: 2.1, z: 0.3 };
  offsetY = 0;

  constructor() {
    //this.init();
    this.csgObj = this.crBoxCSG();
  }

  crBoxCSG() {
    let box = new THREE.Mesh(
      new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
      new THREE.MeshStandardMaterial({ color: 0xff00ff, depthTest: true })
    );
    // let userInfo = { userInfo: { offsetY: 0, size: { x: 1, y: 2.1, z: 0.3 } } } as {};
    // box = Object.assign(box, userInfo);

    scene.add(box);
    return box;
  }

  // в зависимости от типа (дверь, окно) устанавливаем размеры
  protected typeCSG({ type }: { type: string }) {
    let box = this.csgObj;

    if (type === 'wind') {
      this.size = { x: 1.4, y: 1.7, z: 0.3 };
      this.offsetY = 0.7;
    }
    if (type === 'door') {
      this.size = { x: 1, y: 2.1, z: 0.3 };
      this.offsetY = 0;
    }

    box.geometry.dispose();
    box.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
  }

  click({ event, type }: { event: MouseEvent; type: string }) {
    this.typeCSG({ type });

    planeMath.position.y = level.getPosY1();
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    planeMath.updateMatrixWorld();

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length === 0) return;

    let wall: Wall | undefined = undefined;

    canvas.onmousemove = (event) => {
      camOrbit.stopMove = true;
      mouseEv.stop = true;

      let intersects = rayIntersect(event, planeMath, 'one');
      if (intersects.length === 0) return;

      this.csgObj.position.copy(intersects[0].point);

      if (!this.csgObj.geometry.boundingBox) this.csgObj.geometry.computeBoundingBox();
      let bound = this.csgObj.geometry.boundingBox;
      this.csgObj.position.y = (bound!.max.y - bound!.min.y) / 2 + this.offsetY;

      wall = this.findWall({ event });

      if (wall) this.changeWightCsg({ wall });

      this.render();
    };

    canvas.onmousedown = (event) => {
      canvas.onmousemove = null;
      canvas.onmousedown = null;

      camOrbit.stopMove = false;
      mouseEv.stop = false;

      if (event.button === 0) {
        if (wall) this.csgSubtract({ wall });
      }

      this.render();
    };
  }

  protected findWall({ event }: { event: MouseEvent }) {
    let intersects = rayIntersect(event, level.getArrWall(), 'arr');
    if (intersects.length === 0) return;

    let pos = intersects[0].point;
    let wall = intersects[0].object;

    if (!(wall instanceof Wall)) return;

    let p = wall.userInfo.point;

    let pos2 = this.spPoint(p[0].position, p[1].position, pos);

    let dir = new THREE.Vector3().subVectors(p[0].position, p[1].position);
    let rotY = Math.atan2(dir.x, dir.z);

    this.csgObj.position.x = pos2.x;
    this.csgObj.position.z = pos2.z;
    this.csgObj.rotation.y = rotY + Math.PI / 2;

    return wall;
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

  // меняем ширину объекта CSG, чтобы подстроится под ширину стены
  protected changeWightCsg({ wall }: { wall: Wall }) {
    let box = this.csgObj;
    let width = wall.userInfo.width;

    let x = this.csgObj.geometry.parameters.width;
    let y = this.csgObj.geometry.parameters.height;
    box.geometry.dispose();
    box.geometry = new THREE.BoxGeometry(x, y, width * 2 + 0.2);
  }

  // делаем проем в стене
  protected csgSubtract({ wall }: { wall: Wall }) {
    let box = this.csgObj;
    box.updateMatrix();
    wall.updateMatrix();

    const subRes = CSG.subtract(wall, box);
    //subRes.position.add(new THREE.Vector3(0, 3, 0));

    wall.geometry.dispose();
    wall.geometry = subRes.geometry;
  }

  protected render() {
    camOrbit.render();
  }
}
