'use strict'

import {instanceOf} from 'prop-types'
import React, { Component } from 'react'
import { Cookies, withCookies } from 'react-cookie'
import { withRouter } from 'react-router-dom'

// ! css modules
import './app.css'

import Footer from './Footer'
import Main from './Main'
import Navbar from './Navbar'
import Routes from './Routes'

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

/**
 * Top level component of app. Wrapped with providers and rendered by
 * `ReactDOM.render()` in `client/index.jsx`.
 *
 * @param {*} props - contains `cookies: Cookie`
 * @returns {*} ReactElement<any>
 */
class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  constructor(props) {
    super(props)
    const { cookies } = this.props

    this.state = {
      userCookie: cookies.get('connect.sid') || ''
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  render() {
    const { userCookie } = this.state

    return (
      <div>
        <Navbar handleLogout={this.handleLogout} userCookie={userCookie} />
        <hr />
        <Main>
          <Routes userCookie={userCookie} />
        </Main>
        <Footer />
      </div>
    )
  }

  /**
   * Handles logging the currently logged-in user out. Redirects the user to `"/login"`.
   *
   * @param {*} client
   */
  handleLogout(client) {
    // ! new approach
  }
}

export default withCookies(withRouter(App))
