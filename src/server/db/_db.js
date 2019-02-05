import snakeCase from "lodash/snakeCase";
import Sequelize from "sequelize";

import pkg from "../../../package.json";

/**
 * Uses the package name described in `package.json` as a database name.
 * For a testing enviornment, `"_test"` is appended to the database name.
 */
const databaseName =
  snakeCase(pkg.name) + (process.env.NODE_ENV === "test" ? "_test" : "");

/**
 * Instance of database connection.
 *
 * @param {string} host - development: `"localhost"`, production: `"<app-name>.com"`
 */
const db = host =>
  new Sequelize(
    process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
    {
      host,
      logging: false,
      operatorsAliases: false
    }
  );

export default db;
