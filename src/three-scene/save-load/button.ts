import { saveLocalFile } from 'three-scene/save-load/save';
import { loadLocalFile } from 'three-scene/save-load/load';

export function crBtnSave({ container }: { container: HTMLElement }): void {
  //let el: HTMLElement | null = Tscene.container.querySelector('[nameId="blockButton_1"]');
  let html =
    '<div nameId="save" style="position: absolute; left: calc(50% + 70px); top: 30px; transform: translateX(-50%) translateY(-50%); user-select: none;" class="button1 gradient_1">save</div>';
  let div = document.createElement('div');
  div.innerHTML = html;
  let elem = div.firstChild as HTMLElement;

  container.append(elem);

  elem.onmousedown = () => {
    promise_1({ text: 'save' }).then((data) => {
      console.log(data);
      saveLocalFile();
    });
  };
}

export function crBtnLoad({ container }: { container: HTMLElement }) {
  //let el: HTMLElement | null = document.querySelector('[nameId="blockButton_load_1"]');
  let html =
    '<div nameId="save" style="position: absolute; left: calc(50% - 70px); top: 30px; transform: translateX(-50%) translateY(-50%); user-select: none;" class="button1 gradient_1">load</div>';
  let div = document.createElement('div');
  div.innerHTML = html;
  let elem = <HTMLElement>div.firstChild;

  container.append(elem);

  elem.onmousedown = () => {
    promise_1({ text: 'load' }).then((data) => {
      console.log(data);
      loadLocalFile();
    });
  };
}

function promise_1({ text }: { text: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve(text);
  });
}
