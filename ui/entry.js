module.exports = {
  index_ssr: 'src/page/index/server',
  index: [
    'webpack-hot-middleware/client?reload=true',
    'src/page/index/client',
  ],
};
