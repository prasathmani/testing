var webpack = require('webpack');

module.exports = {
  mode: "production",
  context: __dirname,
  devtool: "inline-sourcemap",
  entry: "./src/assets/js/main.js",
  output: {
    path: __dirname + "assets/js",
    filename: "scripts.min.js"
  }
};