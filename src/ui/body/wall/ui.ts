import { Wall } from 'three-scene/plan/wall/index';
import { mouseEv, camOrbit } from 'three-scene/index';

export class UIinpit {
  elem: HTMLElement | null = null;
  input: HTMLInputElement | null = null;

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    let container = document.body.querySelector('[nameId="containerScene2"]');

    container?.append(this.elem);

    this.input = container?.querySelector('[nameId="wall_width"]') as HTMLInputElement;

    this.initEvent();
  }

  html() {
    let style2 = `style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 24px; margin: 0 0 2px 0; font-size: 12px; color: #4A4A4A; border: 1px solid #D1D1D1; border-radius: 4px; box-sizing: border-box; background: #F0F0F0; user-select: none;"`;

    let style = `display: flex; position: absolute; left: 50px; bottom: 40px;  width: 74px; height: 30px; border-right: 1px solid #D1D1D1; box-sizing: border-box;`;

    let html = `<div style="${style}">
            <input type="text" nameId="wall_width" value="0" style="width: 100%;">
        </div>`;

    return html;
  }

  initEvent() {
    //this.input?.addEventListener('change', this.onChange);
    this.input!.onchange = this.onChange;
  }

  onChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    let obj = mouseEv.obj;

    if (obj instanceof Wall) {
      obj.updateGeomWall({ width: Number(event.target.value) });
      camOrbit.render();
    }
  }

  setInputValue(value: number) {
    this.input!.value = '' + value;
  }
}
