import * as THREE from 'three';
import { canvas, camOrbit } from '../index';
import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';

export function rayIntersect(
  event: MouseEvent,
  obj: PointWall | PointWall[] | Wall | Wall[] | THREE.Mesh | THREE.Mesh[],
  t?: string
): THREE.Intersection<PointWall | Wall | THREE.Mesh>[] {
  let mouse = getMousePosition(event);

  function getMousePosition(event: MouseEvent) {
    let rect = canvas.getBoundingClientRect();

    let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    return new THREE.Vector2(x, y);
  }

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camOrbit.activeCam);

  let intersects: THREE.Intersection<PointWall | Wall | THREE.Mesh>[] = [];

  if (t === 'one' && !Array.isArray(obj)) {
    intersects = raycaster.intersectObject(obj);
  } else if (t === 'arr' && Array.isArray(obj)) {
    intersects = raycaster.intersectObjects(obj, true);
  }

  return intersects;
}

// пускаем луч из точки на что-то в сцене
export function rayFromPointToObj({ obj, arr }: { obj: PointWall; arr: PointWall[] }) {
  obj.updateMatrixWorld();
  if (!obj.geometry.boundingSphere) obj.geometry.computeBoundingSphere();
  let posCent = obj.geometry.boundingSphere ? obj.geometry.boundingSphere.center.clone() : new THREE.Vector3();

  let pos = obj.localToWorld(posCent);
  pos.y += 10;

  let arr2 = arr.filter((o) => o !== obj);

  let ray = new THREE.Raycaster();
  ray.set(pos, new THREE.Vector3(0, -1, 0));

  let intersects: THREE.Intersection<PointWall>[] = ray.intersectObjects(arr2, true);

  let o = null;
  if (intersects.length > 0) {
    o = intersects[0].object;
  }

  return o;
}
