import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import App from '../containers/App';

const preloadedState = window.__PRELOADED_STATE__; // eslint-disable-line no-underscore-dangle
const store = configureStore(preloadedState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
if (module.hot) {
  module.hot.accept(App, () => {
    const NextApp = App;
    render(<NextApp />, document.getElementById('root'));
  });
}
