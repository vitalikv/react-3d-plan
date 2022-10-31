import * as THREE from 'three';
import { scene } from 'three-scene/index';

export function initGrid() {
  let grid = crGrid();
  crPlane(grid);

  function crGrid() {
    const grid: THREE.GridHelper = new THREE.GridHelper(30, 30);
    grid.position.y = 0;
    if (!Array.isArray(grid.material)) {
      grid.material.opacity = 1;
      grid.material.transparent = true;
    }

    scene.add(grid);

    return grid;
  }

  function crPlane(grid: THREE.GridHelper) {
    let geometry = new THREE.PlaneGeometry(30, 30);
    let material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      lightMap: crTexture(),
    });

    let obj = new THREE.Mesh(geometry, material);
    obj.position.y = -0.001;
    obj.rotation.set(-Math.PI / 2, 0, 0);

    grid.add(obj);
  }

  function crTexture() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = 64;
    canvas.height = 64;

    context!.fillStyle = 'rgba(255,255,255,1)';
    context!.fillRect(0, 0, canvas.width, canvas.height);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  return grid;
}

function initGridPlane() {
  let grid = crPlane();

  function crPlane() {
    let geometry = new THREE.PlaneGeometry(30, 30);
    let material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      lightMap: crLightMap(),
      map: crTexture(),
      //depthFunc: THREE.GreaterDepth,
    });

    let obj = new THREE.Mesh(geometry, material);
    obj.position.y = -0.0;
    obj.rotation.set(-Math.PI / 2, 0, 0);

    scene.add(obj);

    return obj;
  }

  function crTexture() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = 1024 * 2;
    canvas.height = 1024 * 2;

    context!.fillStyle = 'rgba(255,255,255,1)';
    context!.fillRect(0, 0, canvas.width, canvas.height);

    context!.beginPath();
    context!.lineWidth = 0.5;

    let step = canvas.width / 40;
    for (let a = 0; a < 40; a++) {
      context!.moveTo(0, step * a);
      context!.lineTo(canvas.width, step * a);
      context!.moveTo(step * a, 0);
      context!.lineTo(step * a, canvas.height);
      context!.stroke();
    }

    context!.closePath();

    let texture = new THREE.Texture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

    return texture;
  }

  function crLightMap() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;

    context!.fillStyle = 'rgba(255,255,255,1)';
    context!.fillRect(0, 0, canvas.width, canvas.height);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  return grid;
}
