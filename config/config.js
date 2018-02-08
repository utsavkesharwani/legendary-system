const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'quantinsti-website'
    },
    port: process.env.PORT || 3000,
    db: {
      username: 'root',
      password: 'admin',
      host: "localhost",
      database: "quantinsti_website_development",
      dialect: "mysql"
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'quantinsti-website'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/quantinsti_website_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'quantinsti-website'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/quantinsti_website_production'
  }
};

module.exports = config[env];
