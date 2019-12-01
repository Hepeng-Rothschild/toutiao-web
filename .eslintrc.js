module.exports = {
  // configureWebpack: {
  //   devtool: 'source-map'
  // },
  // lintOnSave: false,
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    // 关闭严格模式
    // '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
