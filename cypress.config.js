// Cypress config in CommonJS to avoid Node --loader / tsx on CI
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    nodeVersion: 'system',
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // Reuse existing plugins file
      return require('./cypress/plugins/index.js')(on, config);
    },
  },
});
