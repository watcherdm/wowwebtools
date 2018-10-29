module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: `${__dirname}/public`, 
    filename: 'js/[name].js'
  },
  watchOptions: {
    ignored: [`${__dirname}/public/json/*.json`, `${__dirname}/node_modules`]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}
