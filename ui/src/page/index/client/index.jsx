import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '../store/configureStore';
import App from '../components/App';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
const container = document.getElementById('root');

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
