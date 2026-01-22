import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import helloReducer from 'src/page/index/store/slices/helloSlice';
import App from 'src/page/index/components/App';

const createTestStore = (preloadedState) =>
  configureStore({
    reducer: { hello: helloReducer },
    preloadedState,
  });

describe('App', () => {
  it('renders greeting with name from store', () => {
    const store = createTestStore({ hello: { name: 'World' } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/Hello World/)).toBeDefined();
  });

  it('renders a click button', () => {
    const store = createTestStore({ hello: { name: 'Test' } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByRole('button', { name: 'Click' })).toBeDefined();
  });

  it('updates name when button is clicked', () => {
    const store = createTestStore({ hello: { name: 'SSR' } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Hello CSR/)).toBeDefined();
  });
});
