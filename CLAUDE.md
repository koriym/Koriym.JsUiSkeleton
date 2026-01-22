# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Koriym.JsUiSkeleton is a JavaScript UI skeleton for PHP projects. It enables writing views in JavaScript (React/Redux) while keeping server-side logic in PHP. Supports three rendering strategies: SSR only, CSR only, and SSR + CSR (hydration).

## Commands

```bash
# Install dependencies
npm install

# Development with HMR (Vite)
npm run dev

# Production build (client + SSR)
npm run build

# Build client bundle only
npm run build:client

# Build SSR bundle only
npm run build:ssr

# Run tests
npm test

# Lint JavaScript
npm run lint
```

## Architecture

### Directory Structure

```text
├── ui/                     # JavaScript application
│   ├── src/page/index/     # Page modules
│   │   ├── server/         # SSR entry (render.jsx)
│   │   ├── client/         # CSR entry (index.jsx)
│   │   ├── store/          # Redux store configuration
│   │   └── components/     # React components
│   ├── dev/                # Development PHP files
│   │   ├── config/         # Render configurations
│   │   ├── csr.php         # Client-side rendering demo
│   │   ├── ssr.php         # Server-side rendering demo
│   │   └── ssr-dev.php     # SSR debugging in browser
│   └── test/               # Test files
├── public/                 # Web root
│   └── build/              # Built bundles output
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── eslint.config.js        # ESLint flat config
└── package.json            # Dependencies and scripts
```

### Rendering Strategies

| Strategy | Server | Client | Use Case |
|----------|--------|--------|----------|
| SSR only | HTML generation | - | Static pages, SEO |
| CSR only | JSON/empty HTML | DOM generation | Dynamic apps |
| SSR + CSR | HTML generation | Hydration | Interactive + SEO |

### Entry Points

Defined in `vite.config.ts`:
- Client: `ui/src/page/index/client/index.jsx` → `public/build/index.bundle.js`
- SSR: `ui/src/page/index/server/render.jsx` → `public/build/index_ssr.bundle.js`

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
| `vite.config.ts` | Vite build configuration |

## Technology Stack

- React 18 / Redux Toolkit 2 / React-Redux 9
- Vite 6
- Vitest
- ESLint 9 (flat config)

## PHP Integration

The PHP side uses `koriym/baracoa` to execute JavaScript:

```php
// SSR example
$execJs = new PhpExecJs();
$js = file_get_contents('public/build/index_ssr.bundle.js');
$html = $execJs->evalJs("{$js}; render({$stateJson}, {$metasJson});");
```
