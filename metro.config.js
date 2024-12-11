const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
  resolver: {
    assetExts: ['db', 'mp4', 'png', 'jpg', 'jpeg', 'svg', 'json', 'ttf', 'mp3', 'otf'],
  },
  server: {
    port: 8081,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return middleware(req, res, next);
      };
    },
    host: '192.168.1.102',
  },
};

module.exports = mergeConfig(defaultConfig, config);
