import * as THREE from 'three';
import * as CAM from './camera';
import * as Wpoint from './plan/point/btn-promise';
import { Mouse } from './mouse-event';
import { Wall } from './plan/wall/index';
import { crPlaneMath } from 'three-scene/core/index';
import { PointWall } from 'three-scene/plan/point/point';
import { initComposerRender } from 'three-scene/core/composer-render';
import { initDeleteObj } from 'three-scene/delete';

export let container: HTMLElement | null, canvas: HTMLCanvasElement, scene: THREE.Scene;
export let mouseEv: Mouse, camOrbit: CAM.CameraOrbit;
export let planeMath: THREE.Mesh;
export let renderer: THREE.WebGLRenderer;
let ambientLight, light;

export function init({ ready }: { ready: () => void }) {
  container = document.body.querySelector('[nameId="containerScene2"]');

  if (!container) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, alpha: true });
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
    canvas: renderer.domElement,
    renderer: renderer,
    scene: scene,
    setCam: '2D',
  });

  //outline
  initComposerRender({ renderer, canvas, scene, camera: camOrbit.activeCam });

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

  //mouse
  mouseEv = new Mouse({ canvas });

  //UI
  Wpoint.crBtnPointWall({ container, canvas: renderer.domElement });

  //planeMath
  planeMath = crPlaneMath();

  //wall
  let p1 = new PointWall({ pos: new THREE.Vector3(-2, 0, 1) });
  let p2 = new PointWall({ pos: new THREE.Vector3(4, 0, 1) });
  new Wall({ p1, p2 });

  //deleteObj
  initDeleteObj();

  //render
  camOrbit.render();

  if (ready) ready();
}
