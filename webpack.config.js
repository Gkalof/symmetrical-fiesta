const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Replace the HTML plugin to use our custom template
  config.plugins = config.plugins.map(plugin => {
    if (plugin instanceof HtmlWebpackPlugin) {
      return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'web/index.html'),
        filename: 'index.html',
      });
    }
    return plugin;
  });

  return config;
}; 