import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'btnCam',

  initialState: [
    { id: 1, type: '2D', display: '' },
    { id: 2, type: '3D', display: 'none' },
  ],

  reducers: {
    toggle(state, action) {
      if (action.payload.type === '2D') {
        state[0].display = 'none';
        state[1].display = '';
      }
      if (action.payload.type === '3D') {
        state[0].display = '';
        state[1].display = 'none';
      }
      console.log(action);
    },
  },
});

export const { toggle } = slice.actions;

export default slice.reducer;
