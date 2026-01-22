# JavaScript UIスケルトン

[![CI](https://github.com/koriym/Koriym.JsUiSkeleton/actions/workflows/ci.yml/badge.svg)](https://github.com/koriym/Koriym.JsUiSkeleton/actions/workflows/ci.yml)

[English](README.md)

PHPアプリケーション向けのJavaScript UIスケルトンです。サーバーサイドレンダリング（SSR）をV8JsまたはNode.jsで実行します。

## スタック

- [Vite](https://vitejs.dev/) - 次世代フロントエンドツール
- [React 18](https://react.dev/) - UIフレームワーク
- [Redux Toolkit](https://redux-toolkit.js.org/) - 状態管理
- [Vitest](https://vitest.dev/) - ユニットテスト
- [ESLint 9](https://eslint.org/) - コードリンティング（フラットコンフィグ）

## 前提条件

- Node.js 20+
- [V8Js PHP extension](https://github.com/phpv8/v8js)（オプション - Node.jsフォールバック利用可能）

## 用語

- SSR - サーバーサイドレンダリング
- CSR - クライアントサイドレンダリング

## レンダリングシナリオ

### SSRのみ

サーバーサイドで静的ページをレンダリングします。JSテンプレートエンジンやReactのようなSSR可能なフレームワークを使用します。

### SSR + CSR（ハイドレーション）

サーバーでHTMLを生成し、クライアントでハイドレーションしてインタラクティブにします。

### CSRのみ

サーバーはJSONを返し、ブラウザでUIをレンダリングします。OGP `<meta>`タグなどDOM以外の要素はPHPで処理します。

## クイックスタート

```bash
composer create-project koriym/js-ui-skeleton -n -s dev js-ui
cd js-ui
npm install
npm run dev
```

## インストール

### 新規プロジェクト

```bash
composer create-project koriym/js-ui-skeleton -n -s dev MyVendor.MyUi
cd MyVendor.MyUi
npm install
```

### 既存プロジェクトに追加

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

### ディレクトリ構造

```text
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── public/
│   └── build/           # ビルド済みバンドル
├── ui/
│   ├── src/
│   │   └── page/
│   │       └── index/
│   │           ├── client/      # クライアントエントリー
│   │           ├── server/      # SSRエントリー
│   │           ├── components/
│   │           └── store/
│   ├── test/
│   └── dev/             # PHP開発スクリプト
└── vendor/
```

## 設定

### 実行設定

JSアプリケーションの設定を`ui/dev/config/`に配置します：

```php
<?php
$app = 'index';
$state = [
    'hello' => ['name' => 'World']
];
$metas = [
    'title' => 'ページタイトル'
];

return [$app, $state, $metas];
```

- `$app` - アプリケーション名（`public/build/{$app}.bundle.js`にマップ）
- `$state` - SSRとクライアント両方に渡される初期状態
- `$metas` - サーバーのみのメタデータ（例：ページタイトル）

## UIアプリケーションの作成

### サーバーサイド（SSR）

HTMLを返す`render`関数を実装します：

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

### クライアントサイド

SSRからのプリロード状態でハイドレーションします：

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

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | HMR付きVite開発サーバーを起動 |
| `npm run build` | クライアントとSSRバンドルをビルド |
| `npm run build:client` | クライアントバンドルのみビルド |
| `npm run build:ssr` | SSRバンドルのみビルド |
| `npm test` | Vitestでテストを実行 |
| `npm run lint` | ESLintを実行 |

## SSRユーティリティライブラリ

[Baracoa](https://github.com/koriym/Koriym.Baracoa)はSSR実行のためのユーティリティライブラリです。パフォーマンス向上のためV8スナップショットをサポートします。
