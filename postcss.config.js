module.exports = {
  plugins: {
    autoprefixer: {},
    // 把px转换成rem
    'postcss-pxtorem':{
      rootValue:37.5,
      propList:['*']
    }
  }
}
