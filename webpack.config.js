const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Plik wejściowy
  output: {
    filename: 'bundle.js', // Plik wyjściowy
    path: path.resolve(__dirname, 'dist'), // Folder wyjściowy
    clean: true, // Czyści folder dist przed budowaniem
  },
  mode: 'development', // Tryb development
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Folder do serwowania
    },
    port: 8080, // Port serwera
    open: true, // Automatycznie otwiera przeglądarkę
    hot: true, // Hot Module Replacement (na żywo)
    compress: true, // Kompresja plików
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Loadery CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Plik szablonu HTML
    }),
  ],
};
