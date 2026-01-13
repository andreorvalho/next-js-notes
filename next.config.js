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

    // Replace all CSS imports from react-quill-ver2 with empty module
    // We import them manually in _app.tsx
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
