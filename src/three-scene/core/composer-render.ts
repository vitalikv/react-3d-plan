import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

export let composer: EffectComposer | null = null;
export let outlinePass: OutlinePass;
let renderPass: RenderPass;

interface Param {
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

export function initComposerRender({ renderer, canvas, scene, camera }: Param) {
  composer = new EffectComposer(renderer);
  composer.renderer.outputEncoding = THREE.sRGBEncoding;
  composer.setSize(canvas.clientWidth, canvas.clientHeight);
  composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
  composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;

  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight), scene, camera);
  composer.addPass(outlinePass);
  outlinePass.overlayMaterial.blending = THREE.CustomBlending; // важно
  outlinePass.visibleEdgeColor.set(0x00ff00);
  outlinePass.hiddenEdgeColor.set(0x00ff00);
  outlinePass.edgeStrength = 5; // сила/прочность
  outlinePass.edgeThickness = 0.5; // толщина
  outlinePass.selectedObjects = [];
}

export function changeCamera({ camera }: { camera: THREE.Camera }) {
  renderPass.camera = camera;
  outlinePass.renderCamera = camera;
}
