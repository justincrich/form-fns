const Dotenv = require('dotenv-webpack');


module.exports = {
  stories: ['./**/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    "@storybook/addon-knobs/register",
    "@storybook/addon-viewport/register",
  ],
  webpackFinal: async (config) => {

    config.plugins.push(new Dotenv())

    return config
  }
};
