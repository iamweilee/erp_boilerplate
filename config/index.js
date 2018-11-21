// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
// 后端服务器地址前缀，在`config.dev.mock`为`false`的情况下，
// 以此前缀开头的请求全部转发至指定服务器`targetUrl`
var config = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsJs: 'static/js',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // mock转发配置项
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    // mock开关
    mock: true,
  },
  // css模块化
  cssModules: false,
  appSrc: path.resolve(__dirname, '../src'),
  appNodeModules: path.resolve(__dirname, '../node_modules')
};
const phpTarget = {
  // target: 'http://xsbn.govmanage.xcl.dev.anhouse.com.cn',
  target: 'https://smartcity-manage.xsbn.anhouse.com.cn', // 测试环境
  secure: false,
  changeOrigin: true,
}
config.dev.proxyTable = {
  '/manage': phpTarget
};
module.exports = config;
