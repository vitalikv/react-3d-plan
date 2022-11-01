import { UIinpit } from 'ui/body/wall/ui';

type Iui = { wall: { input?: UIinpit } };

export class UImain {
  canvas: Iui = {
    wall: { input: undefined },
  };

  constructor() {
    this.canvas.wall.input = new UIinpit();
  }
}
