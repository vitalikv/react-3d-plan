import { createStore } from 'redux';

let defCount = [
  { id: 1, type: '2D', display: 'none' },
  { id: 2, type: '3D', display: '' },
];

const reducer: any = (state: any = defCount, action: { type: string; payload: any | null }) => {
  if (action.type === '2D') {
    state[0].display = 'none';
    state[1].display = '';
  }
  if (action.type === '3D') {
    state[0].display = '';
    state[1].display = 'none';
  }

  state = [...state];

  return state;
};

export const store = createStore(reducer);
