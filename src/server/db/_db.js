'use strict'

import Sequelize from 'sequelize'
import snakeCase from 'lodash/snakeCase'

import pkg from '../../package.json'

const databaseName = snakeCase(pkg.name) + (process.env.NODE_ENV === 'test' ? '_test' : '')

const db = host => new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    host,
    logging: false,
    operatorsAliases: false
  }
)

export default db
