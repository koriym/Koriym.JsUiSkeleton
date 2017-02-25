const path = require('path');

module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*.spec.@(js|jsx)',
    ],
    exclude: [],
    preprocessors: {
      'test/**/*.@(js|jsx)': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'inline-source-map',
      plugins: [
      ],
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            loaders: ['babel-loader'],
            exclude: /(node_modules)/,
          },
        ],
      },
      externals: {
        jsdom: 'window',
        cheerio: 'window',
        'react/lib/ReactContext': true,
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
      },
      resolve: {
        modules: [
          path.join(__dirname, '/../node_modules'),
          __dirname,
        ],
        extensions: ['.js', '.jsx'],
      },
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'build/coverage/',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-chai',
      'karma-coverage',
      'karma-spec-reporter',
    ],
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
  });
};
