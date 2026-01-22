# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Koriym.JsUiSkeleton is a JavaScript UI skeleton for PHP projects. It enables writing views in JavaScript (React/Redux) while keeping server-side logic in PHP. Supports three rendering strategies: SSR only, CSR only, and SSR + CSR (hydration).

## Commands

```bash
# Install dependencies
yarn install

# Development with HMR (PHP + Webpack + BrowserSync)
yarn dev

# UI-only development (no PHP server)
yarn ui

# Production build
yarn build

# Run tests
yarn test

# Lint JavaScript
yarn lint

# Start PHP server only (no HMR)
yarn start
```

## Architecture

### Directory Structure

```
├── ui/                     # JavaScript application
│   ├── src/page/index/     # Page modules
│   │   ├── server/         # SSR entry (render.jsx)
│   │   ├── client/         # CSR entry (index.jsx)
│   │   ├── store/          # Redux store configuration
│   │   ├── reducers/       # Redux reducers
│   │   ├── actions/        # Redux action creators
│   │   ├── components/     # React presentational components
│   │   └── containers/     # Redux-connected containers
│   ├── dev/                # Development PHP files
│   │   ├── config/         # Render configurations
│   │   ├── csr.php         # Client-side rendering demo
│   │   ├── ssr.php         # Server-side rendering demo
│   │   └── ssr-dev.php     # SSR debugging in browser
│   ├── entry.js            # Webpack entry points
│   ├── webpack.config.js   # Webpack configuration
│   ├── gulpfile.js         # Gulp tasks
│   └── karma.conf.js       # Test runner config
├── public/                 # Web root
│   └── dist/               # Built bundles output
└── package.json            # Dependencies and scripts
```

### Rendering Strategies

| Strategy | Server | Client | Use Case |
|----------|--------|--------|----------|
| SSR only | HTML generation | - | Static pages, SEO |
| CSR only | JSON/empty HTML | DOM generation | Dynamic apps |
| SSR + CSR | HTML generation | Hydration | Interactive + SEO |

### Entry Points

Defined in `ui/entry.js`:
- `index_ssr` → `src/page/index/server` → `index_ssr.bundle.js`
- `index` → `src/page/index/client` → `index.bundle.js`

### SSR Flow

1. PHP calls `render(preloadedState, metas)` via PhpExecJs/V8Js
2. `server/render.jsx` creates Redux store and renders React to HTML string
3. State is serialized into `window.__PRELOADED_STATE__`
4. Returns complete HTML document

### CSR/Hydration Flow

1. Browser loads HTML (from SSR or minimal template)
2. `client/index.jsx` reads `window.__PRELOADED_STATE__`
3. Creates Redux store with preloaded state
4. React hydrates existing DOM or renders fresh

## Key Files

| File | Purpose |
|------|---------|
| `ui/src/page/index/server/render.jsx` | SSR render function |
| `ui/src/page/index/client/index.jsx` | CSR entry point |
| `ui/src/page/index/store/configureStore.js` | Redux store factory |
| `ui/entry.js` | Webpack entry definitions |
| `ui/ui.config.js` | Build output paths |

## Technology Stack

- React 15 / Redux 3 / React-Redux 5
- Webpack 2 / Babel 6 / Gulp 3
- Karma / Mocha / Chai / PhantomJS
- ESLint (Airbnb config)
- BrowserSync (HMR proxy)

## PHP Integration

The PHP side uses `nacmartin/phpexecjs` or `koriym/baracoa` to execute JavaScript:

```php
// SSR example
$execJs = new PhpExecJs();
$execJs->createContext(file_get_contents('index_ssr.bundle.js'));
$html = $execJs->evalJs("render($state, $metas)");
```
