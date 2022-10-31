import * as THREE from 'three';
import { composer, changeCamera } from 'three-scene/core/composer-render';

interface Param {
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  setCam: string;
}

export class CameraOrbit {
  params;
  cam2D;
  cam3D;
  activeCam: THREE.Camera;
  planeMath: THREE.Mesh;
  typeBrowser;
  stopMove;
  mouse;

  constructor(params: Param) {
    console.log(params);
    this.params = params;
    this.cam2D = this.initCam2D();
    this.cam3D = this.initCam3D();
    this.planeMath = this.initPlaneMath();
    this.activeCam = this.cam2D;

    this.typeBrowser = this.getBrowser();

    this.stopMove = false;

    this.mouse = { button: '', down: false, move: false, pos: { x: 0, y: 0 } };

    if (params.setCam) this.setActiveCam(params.setCam);
    this.initEvent();
  }

  initEvent() {
    document.body.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    let mouseDown = this.mouseDown.bind(this);
    let mouseMove = this.mouseMove.bind(this);
    let mouseUp = this.mouseUp.bind(this);
    let mouseWheel = this.mouseWheel.bind(this);
    let windowResize = this.windowResize.bind(this);

    this.params.canvas.addEventListener('mousedown', mouseDown, false);
    this.params.canvas.addEventListener('mousemove', mouseMove, false);
    this.params.canvas.addEventListener('mouseup', mouseUp, false);

    //this.params.canvas.addEventListener('touchstart', mouseDown, false);
    //this.params.canvas.addEventListener('touchmove', mouseMove, false);
    //this.params.canvas.addEventListener('touchend', mouseUp, false);

    this.params.canvas.addEventListener('wheel', mouseWheel, false);

    window.addEventListener('resize', windowResize, false);
  }

  initCam2D() {
    let aspect = this.params.canvas.clientWidth / this.params.canvas.clientHeight;
    let d = 5;
    let camera2D = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.0001, 1000);
    camera2D.position.set(0, 10, 0);
    camera2D.lookAt(this.params.scene.position);
    camera2D.zoom = 1;
    camera2D.updateMatrixWorld();
    camera2D.updateProjectionMatrix();

    return camera2D;
  }

  initCam3D() {
    let camera3D = new THREE.PerspectiveCamera(65, this.params.canvas.clientWidth / this.params.canvas.clientHeight, 0.0001, 1000);
    camera3D.rotation.order = 'YZX'; //'ZYX'
    camera3D.position.set(5, 7, 5);
    camera3D.lookAt(new THREE.Vector3());

    camera3D.userData.camera = {};
    camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
    camera3D.userData.camera.d3.targetO = targetO(this.params.scene);
    camera3D.userData.camera.type = 'fly';
    camera3D.userData.camera.click = {};
    camera3D.userData.camera.click.pos = new THREE.Vector3();

    function targetO(scene: THREE.Scene) {
      let material = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 1,
        depthTest: false,
      });
      let obj = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), material);
      obj.renderOrder = 2;
      //obj.visible = false;
      scene.add(obj);

      return obj;
    }

    return camera3D;
  }

  initPlaneMath() {
    let geometry = new THREE.PlaneGeometry(10000, 10000);
    let material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    material.visible = false;
    let planeMath = new THREE.Mesh(geometry, material);
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    this.params.scene.add(planeMath);

    return planeMath;
  }

  setActiveCam(type: string) {
    let cam = type === '2D' ? this.cam2D : this.cam3D;

    this.activeCam = cam;
    if (composer) changeCamera({ camera: this.activeCam });

    this.render();
  }

  mouseDown(event: MouseEvent) {
    if (this.stopMove) return;
    this.mouse.down = true;
    this.mouse.move = false;

    switch (event instanceof MouseEvent && event.button) {
      case 0:
        this.mouse.button = 'left';
        break;
      case 1:
        this.mouse.button = 'right';
        break;
      case 2:
        this.mouse.button = 'right';
        break;
      default:
        this.mouse.button = 'right';
    }

    this.startCam2D({
      camera2D: this.cam2D,
      event: event,
    });
    this.startCam3D({
      camera3D: this.cam3D,
      event: event,
    });

    this.render();
  }

  mouseMove(event: MouseEvent) {
    if (this.stopMove) return;
    if (!this.mouse.down) return;

    if (this.mouse.down && !this.mouse.move) {
      this.mouse.move = true;
    }

    if (this.activeCam === this.cam2D) {
      this.moveCam2D(event);
    } else if (this.activeCam === this.cam3D) {
      this.moveCam3D(event);
    }

    this.render();
  }

  mouseUp(event: MouseEvent) {
    this.mouse.button = '';
    this.mouse.down = false;
    this.mouse.move = false;
  }

  windowResize() {
    const canvas = this.params.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (!needResize) {
      return;
    }

    this.params.renderer.setSize(width, height, false);

    let aspect = width / height;
    let d = 5;

    this.cam2D.left = -d * aspect;
    this.cam2D.right = d * aspect;
    this.cam2D.top = d;
    this.cam2D.bottom = -d;
    this.cam2D.updateProjectionMatrix();

    this.cam3D.aspect = aspect;
    this.cam3D.updateProjectionMatrix();

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    this.render();
  }

  startCam2D({ camera2D, event }: { camera2D: THREE.OrthographicCamera; event: MouseEvent }) {
    if (this.activeCam !== camera2D) return;

    let planeMath = this.planeMath;

    planeMath.position.set(camera2D.position.x, 0, camera2D.position.z);
    planeMath.rotation.set(-Math.PI / 2, 0, 0);
    planeMath.updateMatrixWorld();

    let intersects = this.rayIntersect(event, planeMath);
    if (intersects.length > 0) this.mouse.pos.x = intersects[0].point.x;
    this.mouse.pos.y = intersects[0].point.z;
  }

  startCam3D({ camera3D, event }: { camera3D: THREE.PerspectiveCamera; event: MouseEvent }) {
    if (this.activeCam !== camera3D) {
      return;
    }

    this.mouse.pos.x = event.clientX;
    this.mouse.pos.y = event.clientY;

    if (this.mouse.button === 'left') {
      //var dir = camera.getWorldDirection();
      let dir = new THREE.Vector3().subVectors(camera3D.userData.camera.d3.targetO.position, camera3D.position).normalize();

      // получаем угол наклона камеры к target (к точке куда она смотрит)
      let dergree = THREE.MathUtils.radToDeg(dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z))) * 2;
      if (dir.y > 0) {
        dergree *= -1;
      }

      // получаем угол направления (на плоскости) камеры к target
      dir.y = 0;
      dir.normalize();

      camera3D.userData.camera.d3.theta = THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z) - Math.PI) * 2;
      camera3D.userData.camera.d3.phi = dergree;
    } else if (this.mouse.button === 'right') {
      let planeMath = this.planeMath;

      planeMath.position.copy(camera3D.userData.camera.d3.targetO.position);

      planeMath.rotation.copy(camera3D.rotation);
      planeMath.updateMatrixWorld();

      let intersects = this.rayIntersect(event, planeMath);
      if (!intersects[0]) return;
      camera3D.userData.camera.click.pos = intersects[0].point;
    }
  }

  moveCam2D(event: MouseEvent) {
    if (this.activeCam !== this.cam2D) return;
    if (this.mouse.button === '') return;

    let intersects = this.rayIntersect(event, this.planeMath);

    this.cam2D.position.x += this.mouse.pos.x - intersects[0].point.x;
    this.cam2D.position.z += this.mouse.pos.y - intersects[0].point.z;
  }

  moveCam3D(event: MouseEvent) {
    if (this.activeCam !== this.cam3D) return;

    if (this.mouse.button === 'left') {
      let radious = this.cam3D.userData.camera.d3.targetO.position.distanceTo(this.cam3D.position);

      let theta = -((event.clientX - this.mouse.pos.x) * 0.5) + this.cam3D.userData.camera.d3.theta;
      let phi = (event.clientY - this.mouse.pos.y) * 0.5 + this.cam3D.userData.camera.d3.phi;
      phi = Math.min(170, Math.max(-60, phi));

      this.cam3D.position.x = radious * Math.sin((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);
      this.cam3D.position.y = radious * Math.sin((phi * Math.PI) / 360);
      this.cam3D.position.z = radious * Math.cos((theta * Math.PI) / 360) * Math.cos((phi * Math.PI) / 360);

      this.cam3D.position.add(this.cam3D.userData.camera.d3.targetO.position);
      this.cam3D.lookAt(this.cam3D.userData.camera.d3.targetO.position);

      this.cam3D.userData.camera.d3.targetO.rotation.set(0, this.cam3D.rotation.y, 0);
    }

    if (this.mouse.button === 'right') {
      let intersects = this.rayIntersect(event, this.planeMath);
      if (!intersects[0]) return;
      let offset = new THREE.Vector3().subVectors(this.cam3D.userData.camera.click.pos, intersects[0].point);
      this.cam3D.position.add(offset);
      this.cam3D.userData.camera.d3.targetO.position.add(offset);
    }
  }

  rayIntersect(event: MouseEvent, obj: THREE.Mesh | THREE.Mesh[]) {
    let getMousePosition = (event: MouseEvent) => {
      let rect = this.params.canvas.getBoundingClientRect();

      let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      return new THREE.Vector2(x, y);
    };

    let mouse = getMousePosition(event);

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.activeCam);

    let intersects: THREE.Intersection[] = [];

    if (!Array.isArray(obj)) {
      intersects = raycaster.intersectObject(obj);
    } else if (Array.isArray(obj)) {
      intersects = raycaster.intersectObjects(obj, true);
    }

    return intersects;
  }

  mouseWheel(event: Event) {
    //let delta = event.wheelDelta ? event.wheelDelta / 120 : event.detail ? event.detail / 3 : 0;

    if (!(event instanceof WheelEvent)) return;

    let delta = event.deltaY / 30;

    if (this.activeCam === this.cam2D) {
      this.cameraZoom2D({ camera2D: this.cam2D, delta: delta });
    } else if (this.activeCam === this.cam3D) {
      this.cameraZoom3D({ camera3D: this.cam3D, delta: delta });
    }

    this.render();
  }

  cameraZoom2D({ camera2D, delta }: { camera2D: THREE.OrthographicCamera; delta: number }) {
    let zoom = camera2D.zoom - delta * 0.1 * (camera2D.zoom / 2);

    camera2D.zoom = zoom;
    camera2D.updateProjectionMatrix();
  }

  cameraZoom3D({ camera3D, delta }: { camera3D: THREE.PerspectiveCamera; delta: number }) {
    let movement = delta < 0 ? 1 : -1;
    movement *= 1.2;

    let pos1 = camera3D.userData.camera.d3.targetO.position;
    let pos2 = camera3D.position.clone();

    let dir = camera3D.getWorldDirection(new THREE.Vector3());
    let offset = new THREE.Vector3().addScaledVector(dir, movement);

    pos1 = offsetTargetCam({ posCenter: pos1, dir: dir, dist: 0.1 });
    offset = stopTargetCam({ posCenter: pos1, posCam: pos2, offset: offset });

    // устанавливаем расстояние насколько близко можно приблизиться камерой к target
    function offsetTargetCam({ posCenter, dir, dist }: { posCenter: THREE.Vector3; dir: THREE.Vector3; dist: number }) {
      let dirInvers = new THREE.Vector3(-dir.x, -dir.y, -dir.z);
      let offset = new THREE.Vector3().addScaledVector(dirInvers, dist);

      let newPos = new THREE.Vector3().addVectors(posCenter, offset);

      return newPos;
    }

    // запрещаем перемещение камеры за пределы центра/target
    function stopTargetCam({ posCenter, posCam, offset }: { posCenter: THREE.Vector3; posCam: THREE.Vector3; offset: THREE.Vector3 }) {
      let newPos = new THREE.Vector3().addVectors(posCam, offset);
      let dir2 = new THREE.Vector3().subVectors(posCenter, newPos).normalize();

      let dot = dir.dot(dir2);

      if (dot < 0) {
        offset = new THREE.Vector3().subVectors(posCenter, posCam);
      }

      return offset;
    }

    camera3D.position.add(offset);
  }

  getBrowser() {
    let ua = navigator.userAgent;

    if (ua.search(/MSIE/) > 0) return 'Explorer';
    if (ua.search(/Firefox/) > 0) return 'Firefox';
    if (ua.search(/Opera/) > 0) return 'Opera';
    if (ua.search(/Chrome/) > 0) return 'Chrome';
    if (ua.search(/Safari/) > 0) return 'Safari';
    if (ua.search(/Konqueror/) > 0) return 'Konqueror';
    if (ua.search(/Iceweasel/) > 0) return 'Debian';
    if (ua.search(/SeaMonkey/) > 0) return 'SeaMonkey';

    // Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
    if (ua.search(/Gecko/) > 0) return 'Gecko';

    // а может это вообще поисковый робот
    return 'Search Bot';
  }

  render() {
    if (composer) {
      composer.render();
    } else {
      this.params.renderer.render(this.params.scene, this.activeCam);
    }
  }
}
