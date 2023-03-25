import * as THREE from 'three';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

import { OverrideMaterialManager, BlendFunction, OutlineEffect, EffectComposer, EffectPass, RenderPass as RenderPass2 } from 'postprocessing';

export let composer: EffectComposer | null = null;
export let outlinePass: OutlinePass;
let outlinePass2: EffectPass;
let outlineEffect: OutlineEffect;
let renderPass: RenderPass;
let renderPass2: RenderPass2;

interface Param {
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

export function initComposerRender({ renderer, canvas, scene, camera }: Param) {
  OverrideMaterialManager.workaroundEnabled = true;

  composer = new EffectComposer(renderer, { frameBufferType: THREE.HalfFloatType }); // HalfFloatType -

  renderPass2 = new RenderPass2(scene, camera);
  composer.addPass(renderPass2);

  outlineEffect = new OutlineEffect(scene, camera, {
    blendFunction: BlendFunction.ALPHA,
    edgeStrength: 25,
    pulseSpeed: 0.0,
    visibleEdgeColor: 0x00ff00,
    hiddenEdgeColor: 0x00ff00,
    height: 1080,
    blur: false,
    xRay: true,
  });
  outlinePass2 = new EffectPass(camera, outlineEffect);
  composer.addPass(outlinePass2);
}

export function initComposerRender2({ renderer, canvas, scene, camera }: Param) {
  // composer = new EffectComposer(renderer);
  // composer.renderer.outputEncoding = THREE.sRGBEncoding;
  // composer.setSize(canvas.clientWidth, canvas.clientHeight);
  // composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
  // composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;
  // renderPass = new RenderPass(scene, camera);
  // composer.addPass(renderPass);
  // outlinePass = new OutlinePass(new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight), scene, camera);
  // composer.addPass(outlinePass);
  // outlinePass.overlayMaterial.blending = THREE.CustomBlending; // важно
  // outlinePass.visibleEdgeColor.set(0x00ff00);
  // outlinePass.hiddenEdgeColor.set(0x00ff00);
  // outlinePass.edgeStrength = 5; // сила/прочность
  // outlinePass.edgeThickness = 0.5; // толщина
  // outlinePass.selectedObjects = [];
}

export function changeCamera({ camera }: { camera: THREE.Camera }) {
  if (outlinePass) {
    renderPass.camera = camera;
    outlinePass.renderCamera = camera;
  }

  if (outlineEffect) {
    renderPass2.mainCamera = camera;
    outlinePass2.mainCamera = camera;
  }
}

export function outlineSelectedObjs(obj?: any) {
  if (outlinePass) {
    outlinePass.selectedObjects = obj ? [obj] : [];
  }
  console.log(444);
  if (outlineEffect) {
    obj ? outlineEffect.selection.add(obj) : outlineEffect.selection.clear();
  }
}
