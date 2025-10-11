// filepath: /Users/andreorvalho/projects/tryouts/javascript/notes-next-js/cypress.config.js
module.exports = {
  e2e: {
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): void {
      // implement node event listeners here
      require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3001',
  },
};
