'use strict'

import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import { App } from './components'
import history from './history'

ReactDOM.render(
  <CookiesProvider>
    <Router history={history}>
      <App />
    </Router>
  </CookiesProvider>,
  document.getElementById('app')
)
