const { defineConfig } = require("cypress");
require("dotenv").config();

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  
  reporterOptions: {
    reportDir: "cypress/report",
    overwrite: false,
    html: true,
    json: false,
    charts: true,
    reportPageTitle: "Report",
    reportFilename: "[status]-[datetime]-[name]-report",
    timestamp: "ddmmyy_HHMMss",
  },
  env: {
    ...process.env,
  },
  e2e: {
    setupNodeEvents(on, config) {},
    specPattern: "cypress/**/*.cy.js",
    supportFile: false,
  },
});