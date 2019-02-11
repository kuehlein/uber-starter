import _ from "lodash";
import Sequelize from "sequelize";

import pkg from "../../package.json";

// ! fix redundancy with dbName + host --- server + _db

const dbName =
  process.env.NODE_ENV === "test"
    ? `${_.snakeCase(pkg.name)}_test`
    : _.snakeCase(pkg.name);

/**
 * Instance of database connection.
 *
 * @param {string} host - development: `"localhost"`, production: `"<app-name>.com"`
 */
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
  {
    dialect: "postgres",
    host: process.env.NODE_ENV === "development" ? "localhost" : "example.com",
    logging: false,
    operatorsAliases: false,
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0
    }
  }
);

export default db;
