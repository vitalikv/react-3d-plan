import * as THREE from 'three';
import { canvas, scene, camOrbit, mouseEv, planeMath, lineAxis } from 'three-scene/index';
import { rayIntersect } from 'three-scene/core/rayhit';
import { nearPoint, finishSelectPoint } from 'three-scene/plan/point/index';
import { Wall } from 'three-scene/plan/wall/index';
import { outlinePass } from 'three-scene/core/composer-render';
import { level } from 'three-scene/index';
import { cornersWall } from 'three-scene/plan/wall/corners-wall';

//export let points: PointWall[] = [];

let matDefault = new THREE.MeshStandardMaterial({
  color: 0x222222,
  //depthTest: false,
  //transparent: true,
  wireframe: false,
  depthFunc: THREE.NotEqualDepth,
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
    attrP.array[i + 0] *= 0.1; // x
    attrP.array[i + 2] *= 0.1; // z

    let y = attrP.array[i + 1];
    if (y < 0) {
      attrP.array[i + 1] = 0;
    }
  }

  geometry.attributes.position.needsUpdate = true;

  geometry.userData.attrP = geometry.getAttribute('position').clone();

  return geometry;
}

let idPoint = 1;

export function setIdWallPoint(id: number) {
  idPoint = id;
}

interface UserInfo {
  id: number;
  readonly tag: string;
  readonly pointWall: boolean;
  wall: Wall[];
}

export class PointWall extends THREE.Mesh {
  userInfo: UserInfo = {
    id: 0,
    tag: 'pointWall',
    pointWall: true,
    wall: [],
  };

  constructor({ id, pos }: { id?: number; pos: THREE.Vector3 }) {
    super(geomPoint, matDefault);

    this.initObj({ id });

    this.position.copy(pos);
    this.render();
  }

  protected initObj({ id }: { id?: number } = {}) {
    if (!id) {
      id = idPoint;
      setIdWallPoint(idPoint + 1);
    }

    this.userInfo.id = id;

    scene.add(this);

    level.addPoint({ point: this });
  }

  addWall({ wall }: { wall: Wall }) {
    this.userInfo.wall.push(wall);
  }

  delWall({ wall }: { wall: Wall }) {
    this.userInfo.wall = this.userInfo.wall.filter((o) => o !== wall);
  }

  click({ pos }: { pos: THREE.Vector3 }) {
    start();
    console.log(this.userInfo);

    cornersWall.move({ point: this });

    outlinePass.selectedObjects = [this];
    this.render();

    let offset = this.position.clone().sub(pos);

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

      let pos = new THREE.Vector3().addVectors(intersects[0].point, offset);

      this.movePoint({ point: this, pos });
    };

    canvas.onmouseup = () => {
      canvas.onmousemove = null;
      canvas.onmouseup = null;

      lineAxis.visible(false);
      finishSelectPoint({ obj: this });

      camOrbit.stopMove = false;
      mouseEv.stop = false;

      this.render();
    };
  }

  movePoint({ point, pos }: { point: PointWall; pos: THREE.Vector3 }) {
    lineAxis.visible(false);

    point.position.copy(pos);

    let newPos = nearPoint({ point });

    if (!newPos) newPos = lineAxis.setLine({ point });

    if (newPos) point.position.copy(newPos);

    let angle = true; // углы у стен
    if (angle) {
      cornersWall.move({ point: this });
    } else {
      point.userInfo.wall.forEach((o) => {
        if (o instanceof Wall) o.updateGeomWall();
      });
    }

    this.render();
  }

  delete() {
    // удаляем из точки инфу о соседних точках и о стенах
    this.userInfo.wall.forEach((wall) => this.delWall({ wall }));

    level.delPoint({ point: this });
    scene.remove(this);

    console.log('delete level', level.levels);
  }

  protected render() {
    camOrbit.render();
  }
}
