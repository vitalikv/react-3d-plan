import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { scene, camOrbit } from 'three-scene/index';

import { PointWall } from 'three-scene/plan/point/point';
import { Wall } from 'three-scene/plan/wall/index';

import img1 from 'img/screenshot_1.jpg';

export function testCSG() {
  testWall();
  //testCube();
}

function getMap() {
  let map = new THREE.TextureLoader().load(img1, () => {
    console.log('map.onLoad');
    camOrbit.render();
  });
  map.repeat.set(1.0, 1.0);
  map.offset.set(0, 0);
  map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
  map.encoding = THREE.sRGBEncoding;
  //map.anisotropy = Build.renderer.capabilities.getMaxAnisotropy();
  map.needsUpdate = true;

  return map;
}

function testWall() {
  let point1 = new PointWall({ pos: new THREE.Vector3(-2, 0, 0) });
  let point2 = new PointWall({ pos: new THREE.Vector3(2, 0, 0) });

  let wall = new Wall({ p1: point1, p2: point2 });

  console.log(wall.material);
  if (!Array.isArray(wall.material) && wall.material instanceof THREE.MeshStandardMaterial) {
    wall.material.map = getMap();
    wall.material.needsUpdate = true;
  }

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff00ff }));
  box.position.set(0, 0.8, 0);

  box.updateMatrix();
  wall.updateMatrix();

  const subRes = CSG.subtract(wall, box);
  subRes.position.add(new THREE.Vector3(0, 3, 0));

  box.parent?.remove(box);
  box.geometry.dispose();

  scene.add(subRes);

  camOrbit.render();
}

function testCube() {
  let map = getMap();

  // Make a box mesh
  const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: 0xffffff, map }));

  // make a sphere mesh
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 30, 30), new THREE.MeshStandardMaterial({ color: 0xffffff, map }));

  // Make sure the .matrix of each mesh is current
  box.updateMatrix();
  sphere.updateMatrix();

  // perform operations on the meshes
  const subRes = CSG.subtract(box, sphere);
  const unionRes = CSG.union(box, sphere);
  const interRes = CSG.intersect(box, sphere);

  box.parent?.remove(box);
  box.geometry.dispose();

  sphere.parent?.remove(sphere);
  sphere.geometry.dispose();

  // space the meshes out so they don't overlap
  unionRes.position.add(new THREE.Vector3(0, 0, 5));
  interRes.position.add(new THREE.Vector3(0, 0, -5));

  // add the meshes to the scene
  scene.add(subRes, unionRes, interRes);

  camOrbit.render();
}
