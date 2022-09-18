import { configureStore } from '@reduxjs/toolkit';
import btnCamReduser from './btnCamSlice';
import levelList from './slice/level-list';

export const store = configureStore({ reducer: { btnCam: btnCamReduser, listL: levelList } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
