import { UIlevelList } from 'ui/right-panel/level/level';
import { UItabs } from 'ui/right-panel/tabs/tabs';

export class UIrightPanel {
  elem: HTMLElement | null = null;
  level: UIlevelList | null = null;
  tabs: UItabs | null = null;

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    document.body.append(this.elem);

    this.tabs = new UItabs();
    this.level = new UIlevelList();
  }

  html() {
    let html = `<div nameId="panelR" style="position: absolute; top: 40px; right: 0; bottom: 0; width: 310px; box-sizing: border-box; background: #F0F0F0; border-left: 1px solid #D1D1D1;"></div>`;

    return html;
  }
}
