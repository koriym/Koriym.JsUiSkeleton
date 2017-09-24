const path = require('path');
const browserSync = require('browser-sync').create();
const connect = require('gulp-connect-php');
const phpcs = require('gulp-phpcs');
const phpmd = require('gulp-phpmd-plugin');
const webpack = require('webpack-stream');
const webpack2 = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const gulp = require('gulp');
const webpackConfig = require('./webpack.config.js');
const uiConfig = require('./ui.config');

const bundler = webpack2(webpackConfig);
const base = path.join(__dirname, '../');
const phpFiles = `${base}/src/**/*.php`;
const isUiOnly = process.env.NODE_ENV === 'ui';
const publicPath = isUiOnly ? path.join(__dirname, '/dev') : uiConfig.public;

gulp.task('webpack', () => {
  gulp.src('./src/**')
    .pipe(webpack(webpackConfig, webpack2))
    .pipe(gulp.dest(uiConfig.build))
    .pipe(gulp.dest(path.join(__dirname, '/dev/build')));
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('reload-php', () => {
  browserSync.reload();
});

gulp.task('php', ['webpack'], () => connect.server({
  port: 8080,
  base: publicPath,
}));

gulp.task('browser-sync', ['php'], () => {
  browserSync.init({
    proxy: {
      target: '127.0.0.1:8080',
      middleware: [
        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackConfig.output.publicPath,

          // pretty colored output
          stats: { colors: true },
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler),
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      phpFiles,
    ],
  });
});

gulp.task('sync', ['browser-sync'], () => {
  gulp.watch(
    phpFiles,
    ['reload']
  );
});

gulp.task('php-qa', ['php'], () => {
  gulp.watch(
    phpFiles,
    ['phpcs', 'phpmd']
  );
});

gulp.task('phpcs', () => {
  const standard = path.join(`${base}/phpcs.xml`);
  return gulp.src(phpFiles)
    .pipe(phpcs({
      bin: 'phpcs',
      standard,
      warningSeverity: 0,
      colors: true,
    }))
    .pipe(phpcs.reporter('log'));
});

gulp.task('phpmd', () => {
  const ruleset = path.join(`${base}/phpmd.xml`);
  return gulp.src(phpFiles)
    .pipe(phpmd({
      bin: 'phpmd',
      format: 'text',
      ruleset,
    }))
    .pipe(phpmd.reporter('log'));
});

// start web server
gulp.task('start', ['php']);
// + hot deploy and browser sync
gulp.task('dev', ['sync']);
// + phpmd, phpcs
gulp.task('dev-qa', ['sync', 'php-qa']);
