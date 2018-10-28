module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: `${__dirname}/public`, 
    filename: 'js/[name].js'
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
