import * as THREE from 'three';
import * as CAM from './camera.js';
import * as Wpoint from './plan/point/index';

export let container, camOrbit;
let scene, renderer;
let ambientLight, light;

export function init({ ready }) {
  container = document.body.querySelector('[nameId="containerScene2"]');

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
  const helper = new THREE.GridHelper(200, 200);
  helper.position.y = 0;
  helper.material.opacity = 0.75;
  helper.material.transparent = true;
  scene.add(helper);

  Wpoint.crBtnPointWall({ container, canvas: renderer.domElement });

  //render
  camOrbit.render();

  if (ready) ready();
}
