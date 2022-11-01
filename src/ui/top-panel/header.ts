export class UIheader {
  elem: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    document.body.append(this.elem);
  }

  html() {
    let html = `<div nameId="panelT" class="panelT">
            <div class="title">Test 3D</div>
        </div>`;

    return html;
  }
}
