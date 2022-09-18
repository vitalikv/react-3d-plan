import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wall } from 'three-scene/plan/wall/index';
import { PointWall } from 'three-scene/plan/point/point';

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
//const initialState: { name: string; act: boolean }[] = [];

type LevelItem = { act: boolean; name: string };
const initialState: LevelItem[] = [];

const slice = createSlice({
  name: 'level-list',

  initialState,

  reducers: {
    init(state, action: PayloadAction<LevelItem[]>) {
      state = [];
      state.push(...action.payload);

      return state;
    },
    select(state, action: PayloadAction<number>) {
      state.forEach((i) => (i.act = false));
      state.forEach((i, index) => {
        if (index === action.payload) {
          i.act = true;
        }
      });
    },
  },
});

export const { init, select } = slice.actions;

export default slice.reducer;
