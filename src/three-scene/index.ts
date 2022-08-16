import * as THREE from 'three';
import * as CAM from './camera.js';
import * as Wpoint from './plan/point/index';

interface Param {
  ready: () => void;
}

export let container: HTMLElement | null, canvas: HTMLCanvasElement, scene: THREE.Scene, camOrbit: CAM.CameraOrbit;
export let planeMath: THREE.Mesh;
let renderer;
let ambientLight, light;

export function init({ ready }: { ready: () => void }): void {
  container = document.body.querySelector('[nameId="containerScene2"]');

  if (!container) return;
  //   const container = document.createElement('div');
  //   document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.outline = 'none';
  container.appendChild(renderer.domElement);

  canvas = renderer.domElement;

  // CAMERA
  camOrbit = new CAM.CameraOrbit({
    container: renderer.domElement,
    renderer: renderer,
    scene: scene,
    setCam: '2D',
  });

  //cameraControls.addEventListener('change', render);

  // LIGHTS
  ambientLight = new THREE.AmbientLight(0x333333);

  light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(0.32, 0.39, 0.7);
  scene.add(ambientLight);
  scene.add(light);

  //Grid
  const helper: THREE.GridHelper = new THREE.GridHelper(200, 200);
  helper.position.y = 0;
  if (!Array.isArray(helper.material)) {
    helper.material.opacity = 0.75;
    helper.material.transparent = true;
  }
  scene.add(helper);

  //UI
  Wpoint.crBtnPointWall({ container, canvas: renderer.domElement });

  //planeMath
  planeMath = crPlaneMath();

  //render
  camOrbit.render();

  if (ready) ready();
}

function crPlaneMath(): THREE.Mesh {
  let geometry = new THREE.PlaneGeometry(10000, 10000);
  let material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    visible: false,
  });

  let planeMath = new THREE.Mesh(geometry, material);
  planeMath.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(planeMath);

  return planeMath;
}
