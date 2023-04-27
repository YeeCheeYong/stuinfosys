const { createProxyMiddleware } = require('http-proxy-middleware');
const URL = process.env.REACT_APP_URL;

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: URL,
      changeOrigin: true,
    })
  );
  app.use(
    '**/*.jpg',
    createProxyMiddleware({
      target: URL,
      changeOrigin: true,
    })
  );
};
