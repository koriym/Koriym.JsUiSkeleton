# JS-UI Skeleton

[Japanese](README.ja.md)

## A Javascript UI application skeleton for PHP project

Instead of PHP's Template Engine, Javascript on the server side or the client side is responsible for creating the view. Server-side rendering is done with V8Js or Node.js.
Redux React example code is included, but you can freely select the JS template engine or UI framework.

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

## Rendering

### SSR only

Render the static page on the server side. Use JS's template engine and SSR-enabled view libraries such as ReatJs or VueJs.

### SSR + CSR

Generate DOM on server side and convert it to HTML. The generated DOM is handed over to the browser JS. We use SSR-enabled view libraries like ReatJs and VueJs that can generate DOM.

### CSR only

On the server side, just create JSON and generate DOM or HTML with CSR. Normally the non-DOM part of the document's root (such as the OGP `<meta>` tag) is rendered in PHP.

## Prerequisites

 * [Node](https://nodejs.org/en/)
 * [Yarn](https://yarnpkg.com/)
 * [V8Js PHP extension](https://github.com/phpv8/v8js) (optional)
 

## Demo



```javascript
composer create-project koriym/js-ui-skeleton MyVendor.HelloWorldUi js-ui
cd js-ui
yarn install
yarn run ui
```

## Installation

There are two ways to make the JS UI application an independent project and to include it in the existing PHP project.

### New installation

```
Composer create-project koriym / js-ui-skeleton MyVendor.HelloWorldUi
Cd MyVendor.HelloWorldUi
Yarn install
```

When creating it as a package and using it from a PHP project add that package to dependence.
Since you can manage versions by UI yourself, it is easy to do UI dependency management from PHP projects and parallel work.

### Add to existing project

Add the `ui` folder and` package.json` to the existing project.

```
Cd / path / to / project
Composer require koriym / js-ui-skeleton
Cp vendor / koriym / js - ui - skeleton / ui.
Cp vendor / koriym / js - ui - skeleton / package.json.
Yarn install
```

The directory structure looks like this.

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

## UI Config

Edit `ui/ui.config.js` to specify web public folder and the output directory of the bundled JS file by webpack.

```javascript
Const path = require ('path');

Module.exports = {
   Public: path.join (__ dirname, '../public'),
   Build: path.join (__ dirname, '../public/dist')
};
```

## Entry File

Specify the entry file in `ui / entry.js`. The SSR file is given a `_ssr` postfix.

```javascript
module.exports = {
  index_ssr: 'src/page/index/server',
  index: 'src/page/index/client',
};
```

## Run Config

Set the JS application configuration file in the `ui/dev/config/` directory.

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

`$app` is the application name, corresponding to the file` public/build/dist/{$app}.bundle.js`.
`$initialState` is the initial state of the JS application (in the case of the template engine, it is the value assigned to the template)
`$ssrMetas` is the value passed in SSR only.

Save the setting file with an arbitrary name, You select it on the screen and execute it.

## Create UI Application
### Server side

It takes two kinds of values from PHP and creates a function which assigns html of the whole page to `__SERVER_SIDE_MARKUP__` as a result.

 * `__SSR_METAS__` Value dealt with only SSR
 * `__PRELOADED_STATE__` All other values passed from PHP

```javascript
// server.js

window.__SERVER_SIDE_MARKUP__ = render(window.__PRELOADED_STATE__, window.__SSR_METAS__);

```
### Client side

Prepare the code to insert DOM or HTML into `document.getElementById ('root')`.

```
// client.js reduxの例

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

## Run JS Application

Execute the UI application created with Javascript.

```javascript
yarn run ui
```

Execute the above command and select and execute the rendering method that appeared on the screen.
You can also run server side code in the browser to make debugging easier.

# Command

## Run the PHP application

Start the PHP application on the PHP built-in server.

```
yarn start
```

## Run the PHP application with sync

Start the PHP application with hot module loader and browserSync.

```
Yarn run dev
```

To monitor `phpmd` and `phpcs`, edit the dev command of `phpmd.xml` and` phpcs.xml` installation `package.json` in the project root and change it from` dev` to `dev-qa`.

```
"Dev": "cross-env NODE_ENV = development gulp - gulpfile ui / gulpfile.js dev - qa",
```

## Test

```
Yarn test
```

Monitor JS test execution by `Karma` +` Mocha` + `Chai`. Edit `karma.conf.js` to change the setting.

## Lint

```
Yarn run lint
```

Run [Eslint](http://eslint.org/). Edit `.eslintrc` to change the setting.
