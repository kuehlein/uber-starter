'use strict'

import React, { Component } from 'react'
import { hot } from 'react-hot-loader'

/**
 * Landing page of application. This is the view a user would see upon
 * visiting `'/'`.
 *
 * @returns {*} ReactElement<any>
 */
class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  render() {
    return (
      <div style={{ backgroundColor: 'red' }}>
        <h2>Landing page</h2>
        <h3>{this.state.count}</h3>
        <hr />
        <hr />
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          + 1
        </button>
      </div>
    )
  }
}

export default hot(module)(Landing)
