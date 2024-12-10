const path = require('path');

module.exports = {
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
  resolver: {
    assetExts: ['db', 'mp4', 'png', 'jpg', 'jpeg', 'svg', 'json', 'ttf', 'mp3', 'otf'],
  },
};
