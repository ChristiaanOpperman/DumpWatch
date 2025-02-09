const dotenv = require('dotenv');
dotenv.config();

const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:3000',
//     setupNodeEvents(on, config) {
//       // Ensure environment variables are properly loaded
//       config.env = config.env || {};
//       config.env.jwtSecret = process.env.JWT_SECRET;
//       return config;
//     },
//   },
//   env: {
//     jwtSecret: process.env.JWT_SECRET,
//   },
// });

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        jwtSecret: process.env.JWT_SECRET,
      };
      return config;
    },
  },
});