import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { canvas, scene, camOrbit, planeMath, mouseEv } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { level } from 'three-scene/index';
import { Wall } from 'three-scene/plan/wall/index';

export class MyCSG {
  csgObj = this.crBoxCSG();

  constructor() {
    //this.init();
  }

  crBoxCSG() {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.3), new THREE.MeshStandardMaterial({ color: 0xff00ff }));

    scene.add(box);
    return box;
  }

  click({ event }: { event: MouseEvent }) {
    planeMath.position.y = level.getPosY1();
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    planeMath.updateMatrixWorld();

    let intersects = rayIntersect(event, planeMath, 'one');
    if (intersects.length === 0) return;

    canvas.onmousemove = (event) => {
      camOrbit.stopMove = true;
      mouseEv.stop = true;

      let intersects = rayIntersect(event, planeMath, 'one');
      if (intersects.length === 0) return;

      this.csgObj.position.copy(intersects[0].point);

      this.findWall({ event });

      camOrbit.render();
    };

    canvas.onmousedown = (event) => {
      canvas.onmousemove = null;
      canvas.onmousedown = null;

      camOrbit.stopMove = false;
      mouseEv.stop = false;

      camOrbit.render();
    };
  }

  findWall({ event }: { event: MouseEvent }) {
    let intersects = rayIntersect(event, level.getArrWall(), 'arr');
    if (intersects.length === 0) return;

    let pos = intersects[0].point;
    let wall = intersects[0].object;

    if (wall instanceof Wall) {
      let p = wall.userInfo.point;

      let pos2 = this.spPoint(p[0].position, p[1].position, pos);

      let dir = new THREE.Vector3().subVectors(p[0].position, p[1].position);
      let rotY = Math.atan2(dir.x, dir.z);

      this.csgObj.position.copy(pos2);
      this.csgObj.rotation.y = rotY + Math.PI / 2;
    }
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
}
