import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. запись
// type Item = { name: string; act: boolean };
// type List = Item[];

// 2. аналог 1 записи, но в одну строку в виде джинерика
//type List = Array<{ name: string; act: boolean }>;

// 3. аналог 2 или 1 записи, в одну строку
//type List = { name: string; act: boolean }[];

// 4. присваеваем List этой переменной
//const initialState:List = [];

// 5. самая коротка запись
const initialState: { name: string; act: boolean }[] = [];

const slice = createSlice({
  name: 'level-list',

  initialState,

  reducers: {
    init(state) {
      state = [
        { name: '1 level', act: true },
        { name: '2 level', act: false },
        { name: '3 level', act: false },
      ];
    },
    select(state, action: PayloadAction<string>) {
      state.forEach((i) => (i.act = false));
      state[1].act = true;
      console.log('level-list', state);
    },
  },
});

export const { init, select } = slice.actions;

export default slice.reducer;
