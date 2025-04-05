const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../static/geoapi'), // Полный абсолютный путь
    publicPath: '/static/geoapi/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css' // Относительно output.path
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
};