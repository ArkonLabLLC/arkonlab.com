'use strict';

// Build originally from: https://github.com/preboot/angularjs-webpack
// Now with more tweaks.

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

const extractCss = new ExtractTextPlugin({
  filename: 'css/[name]-[hash].css',
  disable: !isProd,
  allChunks: true
});
const extractSass = new ExtractTextPlugin({
  filename: 'css/[name]-sass-[hash].css',
  disable: !isProd,
  allChunks: true
});

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  config.entry = './src/js/index.js';

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://localhost:8080/',

    // Filename for entry points
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    //config.devtool = 'eval-source-map'; This isn't working in chrome for whatever reason.
    config.devtool = 'source-map';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

    // Initialize module
  config.module = {
    rules: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development.

      loader: extractCss.extract({
        fallbackLoader: 'style-loader',
        loader: [
          {loader: 'css-loader', query: {sourceMap: true}},
          {loader: 'postcss-loader'}
        ],
      })
    }, {
      test: /\.s[ca]ss$/,
      use: extractSass.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader'
        }, {
          loader: 'sass-loader',
          // options: {
          //   data: '@import "variables";',
          //   includePaths: [
          //     path.resolve(__dirname, "./src/style")
          //   ]
          // }
        }]
      })
    }, {
      // FONT LOADER
      test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9#]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      }]
    }, /*
     I'm commenting this out as we don't load images through JS
     and at current SVGs for fonts are being double-copied.
      {
     // IMG LOADER
     // Reference: https://github.com/webpack/file-loader
     // Copy png, jpg, jpeg, gif, svg files to output
     // Rename the file using the asset hash
     // Pass along the updated reference to your code
     // You can add here any file extension you want to get copied to your output
     test: /\.(png|jpg|jpeg|gif|svg)$/,
     loader: 'file-loader',
     options: {
     name: 'img/[name].[ext]'
     }
     }, */
      {
        // HTML LOADER
        // Reference: https://github.com/webpack/raw-loader
        // Allow loading html through js
        test: /\.html$/,
        loader: 'raw-loader'
      }]
  };

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  // NOTE: This is now handled in the `postcss.config.js`
  //       webpack2 has some issues, making the config file necessary

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    }),
    // new WebpackBuildNotifierPlugin({
    //   title: 'Web Build',
    //   onClick: () => {},
    //   successSound: 'Tink',
    //   warningSound: 'Glass',
    //   failureSound: 'Funk',
    //   notifyOptions: {
    //     wait: false,
    //     timeout: 3,
    //   }
    // }),
    // Give everyone jQuery
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      $: 'jquery'
    }),
  ];

  config.externals = [
    {'window': 'window'}
  ];

  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body'
    }),

    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    extractCss,
    extractSass
  )

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: https://webpack.js.org/plugins/no-emit-on-errors-plugin/
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin(),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public'
      }])
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal',
    host: 'localhost',
    inline: true,  // This toggles auto-reload
    historyApiFallback: false,  // Turn this back on if we switch to HTML5 mode
    proxy: {
      '/api': 'http://localhost:6543'
    }
  };

  //config.devServer = {
  //  index: '/',
  //  host: '0.0.0.0',
  //  contentBase: 'src/public',
  //  proxy: {
  //    context: () => true,
  //    target: 'http://localhost:6543'
  //  }
  //};

  return config;
}();
