// ! css modules
import "./signupAndLogin.css";

import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";

import { encryptReqData } from "../utils";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

/**
 * The root of the `SignupAndLogin` form. Contains the logic to
 * manage the react state / submit the form.
 *
 * @param {*} props - `{ formType: "Signup" | "Login }`
 * @returns {*} ReactElement<any>
 */
export default class SignupAndLogin extends Component {
  // `Signup` form is displayed by default.
  static defaultProps = {
    formType: "Signup"
  };

  /**
   * Preserve the initial state in a new object. Use this to reset
   * the form's state if `this.props.formType` changes`.
   */
  baseState = {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: ""
  };

  constructor(props) {
    super(props);
    this.state = _.cloneDeep(this.baseState);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * If `this.props.formType` changes, reset the state of the form.
   *
   * @param {*} nextProps - `{ formtype: string }`
   */
  componentWillReceiveProps(nextProps) {
    const { formType } = this.props;

    if (formType !== nextProps.formType) {
      this.setState(this.baseState);
    }
  }

  /**
   * Updates the react state with a given input and a given value.
   *
   * @param {string} value - the new value of this piece of SignupAndLogin state
   * @param {string} key   - part of SignupAndLogin state being updated
   */
  handleChange(value, key) {
    this.setState({ [key]: value });
  }

  /**
   * Either logs-in a user or signs-up a new user, depending on the
   * given props to this component either `Signup` or `Login`.
   *
   * @param {*} signup - // ! will probably be changed
   */
  handleSubmit(signup) {
    const { email, password } = this.state;

    const user = {
      email: encryptReqData(email),
      password: encryptReqData(password)
    };

    // ! previously apollo --- need a new way to signup and login

    // ! since fields arent controlled, they arent being cleared
    this.setState(this.baseState);
  }

  render() {
    const { formType } = this.props;
    const Form = formType === "Signup" ? SignupForm : LoginForm;

    const debouncedHandleChange = _.debounce(this.handleChange, 300);
    const changeHandler = (value, key) => debouncedHandleChange(value, key);

    return (
      <Form
        handleChange={changeHandler}
        handleSubmit={this.handleSubmit}
        user={this.state}
      />
    );
  }
}

SignupAndLogin.propTypes = {
  formType: PropTypes.oneOf(["Signup", "Login"])
};

/**
 * ! ---CONTROL FLOW---
 *
 * * signup:
 *    - new user fills out form and submits
 *      - before submission:
 *         + equality of fields' and confirm fields' values
 *           are checked
 *         + length is checked for all fields
 *         + complexity of password is checked
 *      - after submission:
 *         + uniqueness of email is checked
 *           ! FAIL: user email in use --- try again
 *         + user is logged in on backend
 *         + user is directed to form to fill out account info
 *           * account placed in limited state until completion
 *
 * * login:
 *    - user fills out form and submits:
 *       - success:
 *         + user is directed to home page
 *       - fail:
 *         + user is told that either email or password invalid
 *
 */
