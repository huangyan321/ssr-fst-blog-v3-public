const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: '3'
    }
  ],
  [
    '@babel/preset-typescript',
    {
      // 注意：.vue文件需要通过vue-loader转到babel，但是babel默认不处理.vue文件，设置以下选项
      allExtensions: true
    }
  ]
];
// const plugins = ['@babel/plugin-transform-modules-commonjs'];
// const env = {
//   development: {
//     compact: false
//   }
// };
module.exports = {
  presets,
  // plugins,
  sourceType: 'unambiguous',
  // env
};
