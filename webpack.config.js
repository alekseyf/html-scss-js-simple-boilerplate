const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: (isDev) ? '[name].[contenthash].js' : '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  devServer: {
    port: 8080,
    hot: true,
    static: ['assets'],
    watchFiles: ['src/*.html']
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          (isDev) ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    }
                  ]
                ]
              }
            }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: (name) => {
            const path = name.filename.split("/").slice(1, -1).join("/");
            return `${path}/[name][ext]`;
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: (name) => {
            const path = name.filename.split("/").slice(1, -1).join("/");
            return `${path}/[name][ext]`;
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (isDev) ? '[name].[contenthash].css' : '[name].css',
    }),
    new HTMLWebpackPlugin({
      template: './index.html'
    })
  ]
}
