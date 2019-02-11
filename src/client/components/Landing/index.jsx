import React, { Component } from "react";
import { hot } from "react-hot-loader";

/**
 * Landing page of application. This is the view a user would see upon
 * visiting `'/'`.
 *
 * @returns {*} ReactElement<any>
 */
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;

    return (
      <div style={{ backgroundColor: "cyan" }}>
        <h2>Landing page</h2>
        <h3>{count}</h3>
        <hr />
        <hr />
        <button
          type="button"
          onClick={() => this.setState({ count: count + 1 })}
        >
          + 1
        </button>
      </div>
    );
  }
}

export default hot(module)(Landing);
