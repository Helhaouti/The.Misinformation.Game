const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    study_upload: './src/pages/studyUpload.ts',
    study_overview: './src/pages/studyOverview.ts',
    study_details: './src/pages/studyDetails.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)$/, // Handles .ts and .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // ECMAScript features
              '@babel/preset-typescript' // Adds TypeScript support
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};
