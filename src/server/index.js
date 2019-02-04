'use strict'

import path from 'path'

import Server from './server'

const app = new Server()

if (process.env.NODE_ENV !== 'production') {
  require(path.resolve(__dirname, '..', '..', 'secrets.js'))
}

// this evaluates to true when executed from the command line
// creates an instance of the server for either development or production
require.main === module ? app.createAppDev() : app.createAppProd()

export default app
