import { configureStore } from '@reduxjs/toolkit';
//import { createStore } from '@reduxjs/toolkit';
//import { createStore } from 'redux';
import btnCamReduser from './btnCamSlice';

export const store = configureStore({ reducer: { btnCam: btnCamReduser } });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
