const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'svg', 'gif', 'bmp', 'webp'], // 기본 asset 확장자
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'json'], // JSON 확장자 추가
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
