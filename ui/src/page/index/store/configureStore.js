import { configureStore as createStore } from '@reduxjs/toolkit';
import helloReducer from './slices/helloSlice';

export const configureStore = (preloadedState) =>
  createStore({
    reducer: {
      hello: helloReducer,
    },
    preloadedState,
  });
