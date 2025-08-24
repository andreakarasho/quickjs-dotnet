const path = require('path');

module.exports = {
  mode: 'production',
  entry: './main.jsx',
  output: {
    path: path.resolve(__dirname, '.'),
  filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "crypto": false,
      "stream": false,
      "util": false,
      "buffer": false,
      "assert": false,
      "http": false,
      "https": false,
      "zlib": false
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  }
};
