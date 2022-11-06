import './list.scss';
import { level } from 'three-scene/index';

export class UIlevelList {
  elem: HTMLElement | null = null;
  items: { act: boolean; name: string; el: HTMLElement }[] = [];

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    let container = document.body.querySelector('[nameId="panelR"]');
    container?.append(this.elem);
  }

  html() {
    let html = `<div nameId="listFloor" class="listFloor"></div>`;

    return html;
  }

  resetList() {
    this.items = [];
    this.elem!.innerHTML = '';
  }

  crList({ arr }: { arr: { act: boolean; name: string }[] }) {
    this.resetList();

    for (let i = 0; i < arr.length; i++) {
      let elem = this.crItem({ item: arr[i] });

      this.items.push({ ...arr[i], el: elem });
    }

    if (this.items.length > 0) this.items[0].el.style.background = 'rgb(167, 207, 242)';
  }

  crItem({ item }: { item: { act: boolean; name: string } }) {
    let div = document.createElement('div');
    div.innerHTML = this.htmlItem({ name: item.name });
    let elem = div.children[0] as HTMLElement;

    this.elem?.append(elem);

    elem!.onmousedown = (e) => {
      this.clickItem({ event: e });
    };

    return elem;
  }

  htmlItem({ name }: { name: string }) {
    let html = `<div class="item" style="background: #ffffff">${name}</div>`;

    return html;
  }

  clickItem({ event }: { event: MouseEvent }) {
    let id: undefined | number = undefined;
    let arr = this.items;

    for (let i = 0; i < arr.length; i++) {
      arr[i].el.style.background = '#ffffff';
      if (event.target === arr[i].el) id = i;
    }

    if (event.target instanceof HTMLElement) event.target.style.background = 'rgb(167, 207, 242)';

    if (typeof id === 'number') level.changeLevelAct({ id });
  }
}
