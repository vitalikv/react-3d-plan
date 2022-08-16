import { store } from '../../../ui/store/store';
import { toggle } from '../../../ui/store/btnCamSlice';

export function crBtnPointWall({ container, canvas }: { container: HTMLElement; canvas: HTMLCanvasElement }): void {
  //let el: HTMLElement | null = Tscene.container.querySelector('[nameId="blockButton_1"]');
  let html = '<div style="position: absolute; left: 60px; top: 40px;" class="button1 gradient_1">point 1</div>';
  let div = document.createElement('div');
  div.innerHTML = html;
  let elem = div.firstChild as HTMLElement;

  container.append(elem);

  const { dispatch } = store;

  elem.onmouseup = () => {
    promise_1().then((data) => {
      console.log(data);
      dispatch(toggle({ type: '2D' }));
    });
  };

  function promise_1(): Promise<any> {
    return new Promise((resolve, reject) => {
      document.onmousemove = function (event) {
        if (event.target === canvas) {
          document.onmousemove = null;
          resolve({ event: event });
        }
      };
    });
  }
}