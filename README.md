# JS-UI Skeleton

[![CI](https://github.com/koriym/Koriym.JsUiSkeleton/actions/workflows/ci.yml/badge.svg)](https://github.com/koriym/Koriym.JsUiSkeleton/actions/workflows/ci.yml)

[Japanese](README.ja.md)

## A JavaScript UI application skeleton for PHP projects

Server-side rendering (SSR) with V8Js or Node.js for PHP applications. Build your views with modern JavaScript while keeping application logic in PHP.

## Stack

- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [React 18](https://react.dev/) - UI framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Vitest](https://vitest.dev/) - Unit testing
- [ESLint 9](https://eslint.org/) - Code linting (flat config)

## Prerequisites

- Node.js 20+
- [V8Js PHP extension](https://github.com/phpv8/v8js) (optional - Node.js fallback available)

## Rendering Modes

### SSR Only

Render static pages on the server side. Use JS template engines or SSR-enabled frameworks like React.

### SSR + CSR (Hydration)

Generate HTML on the server, then hydrate on the client for interactivity.

### CSR Only

Server returns JSON; the browser renders the UI. Use PHP for non-DOM elements like OGP `<meta>` tags.

## Quick Start

```bash
composer create-project koriym/js-ui-skeleton -n -s dev js-ui
cd js-ui
npm install
npm run dev
```

## Installation

### New Project

```bash
composer create-project koriym/js-ui-skeleton -n -s dev MyVendor.MyUi
cd MyVendor.MyUi
npm install
```

### Add to Existing Project

```bash
cd path/to/project
composer require koriym/js-ui-skeleton 1.x-dev
cp -r vendor/koriym/js-ui-skeleton/ui .
cp vendor/koriym/js-ui-skeleton/package.json .
cp vendor/koriym/js-ui-skeleton/vite.config.ts .
cp vendor/koriym/js-ui-skeleton/vitest.config.ts .
cp vendor/koriym/js-ui-skeleton/eslint.config.js .
npm install
```

### Directory Structure

```text
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── public/
│   └── build/           # Built bundles
├── ui/
│   ├── src/
│   │   └── page/
│   │       └── index/
│   │           ├── client/      # Client entry
│   │           ├── server/      # SSR entry
│   │           ├── components/
│   │           └── store/
│   ├── test/
│   └── dev/             # PHP dev scripts
└── vendor/
```

## Configuration

### Run Config

Set the JS application configuration in `ui/dev/config/`:

```php
<?php
$app = 'index';
$state = [
    'hello' => ['name' => 'World']
];
$metas = [
    'title' => 'Page Title'
];

return [$app, $state, $metas];
```

- `$app` - Application name (maps to `public/build/{$app}.bundle.js`)
- `$state` - Initial state passed to both SSR and client
- `$metas` - Server-only metadata (e.g., page title)

## Creating UI Applications

### Server Side (SSR)

Implement a `render` function that returns HTML:

```javascript
// server/render.jsx
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
```

### Client Side

Hydrate with the preloaded state from SSR:

```javascript
// client/index.jsx
import { hydrateRoot, createRoot } from 'react-dom/client';
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
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build client and SSR bundles |
| `npm run build:client` | Build client bundle only |
| `npm run build:ssr` | Build SSR bundle only |
| `npm test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |

## SSR Utility Library

[Baracoa](https://github.com/koriym/Koriym.Baracoa) is a utility library for SSR execution. Supports V8 snapshots for improved performance.
