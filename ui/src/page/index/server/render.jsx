import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import App from '../components/App';
import { configureStore } from '../store/configureStore';

const render = (preloadedState, metas) => {
  const store = configureStore(preloadedState);
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${metas.title ?? ''}</title>
  </head>
  <body>
    <div id="root">${html}</div>
    <script>window.__PRELOADED_STATE__ = ${serialize(preloadedState)}</script>
    <script src="/build/index.bundle.js"></script>
  </body>
</html>`;
};

export default render;
