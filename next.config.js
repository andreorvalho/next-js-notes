const webpack = require('webpack');
const path = require('path');

module.exports = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  webpack: (config) => {
    const emptyModulePath = path.resolve(__dirname, 'webpack-empty-module.js');

    // Replace CSS imports from node_modules with empty (Next.js blocks those)
    // We import Quill CSS manually from _app.tsx using local copies in styles/vendor/
    const cssImportsToReplace = [
      /highlight\.js\/styles\/github\.css$/,
      /quill\/dist\/quill\.snow\.css$/,
      /quill\/dist\/quill\.bubble\.css$/,
    ];

    cssImportsToReplace.forEach((pattern) => {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(pattern, emptyModulePath)
      );
    });

    return config;
  },
};
