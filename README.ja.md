# Javascript UIスケルトン

[English](README.md)

PHPのテンプレートエンジンの代わりに、サーバーサイドまたはクライアントサイドのJavascriptがビューをレンダリングします。サーバーサイドのレンダリングは`V8Js`または`Node.js`で実行されます。

Redux+Reactのサンプルコードが含まれますが、JSテンプレートエンジンまたはビューライブラリは選択可能です。


 * [Webpack 2](https://webpack.github.io/) Moudle bundler
 * [Gulp](http://gulpjs.com/) Build system
 * [Babel](https://babeljs.io/) JS transpiler
 * [Karma](https://karma-runner.github.io/0.13/index.html) Test Runner
 * [Mocha](http://mochajs.org/) Test framework
 * [Chai](http://chaijs.com/) BDD / TDD assertion framework
 * [Enzyme](https://github.com/airbnb/enzyme) JavaScript Testing utilities for React
 * [Eslint](http://eslint.org/) Linting utility for JS and JSX
 * [Phantomjs](http://phantomjs.org/) Scriptable Headless WebKit
 * [React](https://facebook.github.io/react/) UI framework
 * [React Hot Loader 3](http://gaearon.github.io/react-hot-loader/) + [BrowserSync](https://browsersync.io/) Live update
 * [Redux](http://redux.js.org/) State container

## 用語

 * SSR サーバーサイドレンダリング 
 * CSR クライアントサイドレンダリング 

## レンダリングシナリオ

### SSRのみ

サーバーサイドで静的ページをレンダリングします。JSのテンプレートエンジンやReatJsやVue.jsのようなSSR可能なビューライブラリを使用します。

### SSR + CSR

サーバーサイドででDOMを生成しHTMLに変換します。生成されたDOMはブラウザのJSに引き継がれます。ReatJsやVue.jsのようなSSR可能でDOMを生成可能なビューライブラリを使用します。

### CSRのみ

サーバーサイドではJSONを作成するだけでCSRでDOMまたはHTMLを生成します。通常ドキュメントルートのDOM以外の部分はPHPでレンダリングします。

## 前提条件

 * [Node.js](https://nodejs.org/en/)
 * [Yarn](https://yarnpkg.com/)
 * [V8Js PHP extension](https://github.com/phpv8/v8js)  (オプション)
 

## デモ

Redux-ReactでHelloWorldを実行するデモです。[Node.js](http://nodejs.jp/nodejs.org_ja/docs/v0.10/)と[Yarn](https://yarnpkg.com/lang/en/docs/install/)をインストールして実行してみましょう。

```javascript
composer create-project koriym/js-ui-skeleton -n -s dev js-ui
cd js-ui
yarn install
yarn run ui
```

## インストール

JS UIアプリケーションを独立したプロジェクトにする方法と、既存のPHPのプロジェクトに含む方法があります。

### 新規インストール

```
composer create-project koriym/js-ui-skeleton -n -s dev MyVendor.MyUi
cd MyVendor.MyUi
yarn install
```

パッケージとして作成し、PHPプロジェクトから利用する場合はそのパッケージを依存に加えます。
UI独自でバージョンを管理することができるので、PHPプロジェクトからのUI依存管理と並行作業が容易です。

### 既存のプロジェクトに追加

`ui`フォルダと`package.json`を既存のプロジェクトに加えます。

```
cd path/to/project
composer require koriym/js-ui-skeleton
cp vendor/koriym/js-ui-skeleton/ui .
cp vendor/koriym/js-ui-skeleton/package.json .
yarn install
```

ディレクトリ構造はこのようになります。

```
├── src             # php
├── tests           # php
├── package.json    # JS
├── node_modules    # JS
├── ui              # JS
│   ├── .babelrc
│   ├── .eslintrc
│   ├── entry.js
│   ├── gulpfile.js
│   ├── karma.conf.js
│   ├── src
│   ├── test
│   ├── ui.config.js
│   └── webpack.config.js
└── vendor
```

## フォルダ設定

`ui/ui.config.js`を編集してpublicフォルダとwebpackでバンドルされるファイルの出力先を指定します。

```javascript
const path = require('path');

module.exports = {
  public: path.join(__dirname, '../public'),
  build: path.join(__dirname, '../public/dist')
};

```

## エントリーファイル設定

`ui/entry.js`にエントリーファイルを指定します。SSRのファイルには`_ssr`ポストフィックスをつけます。(hot module loaderを無効にします)

```javascript
module.exports = {
  index_ssr: 'src/page/index/server',
  index: 'src/page/index/client',
};
```

## 開発用UIアプリの実行設定

`ui/dev/config/`フォルダに、JSアプリケーションの設定ファイルを設置します。

```php
<?php
$app = 'index';
$initialState = [
    'hello' =>['name' => 'World']
];
$ssrMetas = [
    'title' =>'page-title'
];

return [$app, $initialState, $ssrMetas];
```
`$app`はアプリケーション名で、`public/build/dist/{$app}.bundle.js`のファイルに対応します。
`$initialState`はJSアプリケーションの初期状態（テンプレートエンジンの場合はテンプレートにアサインする値）で
`$ssrMetas`はSSRだけの時に渡される値です。

任意の名前で設定ファイルを保存して、画面で選択して実行します。

## webルートパス設定

`ui/ui.config/js`でweb公開ルートパス`public`とJSのビルド先を指定します。

```javascript
const path = require('path');
module.exports = {
  public: path.join(__dirname, '../public'),
  build: path.join(__dirname, '../public/dist')
};
```

## UIアプリケーションの作成

### サーバーサイド

JSアプリケーションはパラメーターを２つ（`preloadedState`と`metas`）受け取りhtml文字列を返す関数を作成して公開します。以下のコードはReduxの典型的なSSRアプリケーションの例です。

```javascript
// server.js
import render from './render';

global.render = render;
```

```javascript
// render.js
const render = (preloadedState, metas) => {
  return
  `<html>
    <head>
      <title>${escape(metas.title)}</title>
    </head>
    <body>
      <script>window.__PRELOADED_STATE__ = ${serialize(preloadedState)}</script>
    <body>
  </html>`
};
export default render;
```

### クライアントサイド

サーバーサイドでレンダリングから渡された`preloadedState`を用いてDOMを生成し、ドキュメントのルートDOMにします。クラアイントはサーバーサイドのDOMを引き継ぐことができます。

```
// client.js
const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

## JSアプリケーションの実行

Javascriptで作成したUIアプリケーションを実行します。

```javascript
yarn run ui
```
上記コマンドを実行して画面に現れたレンダリング方法を選んで実行します。
デバックを容易にするためサーバーサイドコードをブラウザで実行することもできます。

# コマンド

## PHPアプリケーションの実行

`public`で指定したPHPアプリケーションをPHPビルトインサーバーで実行します。

```
yarn start
```

## PHPアプリケーションの開発実行

hot module loaderとbrowserSyncを使って実行します。

```
yarn run dev
```

phpmdとphpcsの監視を行う場合にはプロジェクトルートに`phpmd.xml`と`phpcs.xml`設置`package.json`のdevコマンドを編集し`dev`から`dev-qa`に変更します。

```
"dev": "cross-env NODE_ENV=development gulp --gulpfile ui/gulpfile.js dev-qa",
```

## テスト

```
yarn test      
```

JSのテストを`Karma`+`Mocha`+`Chai`で実行監視します。設定を変更するには`karma.conf.js`を編集します。

## リント

```
yarn run lint
```

[Eslint](http://eslint.org/)を実行します。設定を変更するには`.eslintrc`を編集します。

# SSRユーティリティ

[Baracoa](https://github.com/koriym/Koriym.Baracoa)はSSRのためのユーティリティライブラリで、V8を高速に実行するためのスナップショットの機能をサポートします。

