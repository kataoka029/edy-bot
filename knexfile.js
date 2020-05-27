const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: 5432,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./models/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./models/seeds",
    },
  },

  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "dbniuolm51dam7",
  //     user: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     host: "ec2-54-175-117-212.compute-1.amazonaws.com",
  //     port: 5432,
  //     ssl: { rejectUnauthorized: false },
  //   },
  //   migrations: {
  //     directory: "./models/migrations",
  //     tableName: "knex_migrations",
  //   },
  // },
};
