export class UItabs {
  elem: HTMLElement | null = null;
  list: { name: string }[] = [{ name: 'план' }, { name: 'каталог' }, { name: 'смета' }];

  constructor() {
    this.init();
    this.initTabs();
  }

  init() {
    let div = document.createElement('div');
    div.innerHTML = this.html();
    this.elem = div.children[0] as HTMLElement;

    let container = document.body.querySelector('[nameId="panelR"]');
    container?.append(this.elem);
  }

  html() {
    let html = `
        <div nameId="tabs" style="display: flex; margin-top: 10px; border-bottom: 1px solid #ccc; user-select: none;">
            <div style="display: flex; width: 100%; height: 30px; margin: 0 10px;"></div>
        </div>`;

    return html;
  }

  initTabs() {
    let arr = this.list;

    for (let i = 0; i < arr.length; i++) {
      let elem = this.crItem({ item: arr[i] });
    }
  }

  crItem({ item }: { item: { name: string } }) {
    let div = document.createElement('div');
    div.innerHTML = this.htmlItem({ name: item.name });
    let elem = div.children[0] as HTMLElement;

    this.elem?.children[0].append(elem);

    elem!.onmousedown = (e) => {
      this.clickItem({ event: e });
    };

    return elem;
  }

  htmlItem({ name }: { name: string }) {
    let style = `display: flex; align-items: center; justify-content: center; flex: content; font-size: 14px; color: #666; background: #fff; border: 1px solid #ccc; border-bottom: none; box-sizing: border-box; cursor: pointer;`;

    let html = `
        <div style="${style}">
            <div>${name}</div>
        </div>`;

    return html;
  }

  clickItem({ event }: { event: MouseEvent }) {
    console.log(event);
  }
}
