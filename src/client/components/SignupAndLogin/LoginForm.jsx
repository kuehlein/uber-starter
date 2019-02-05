import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";

import { MForm, MInput } from "../Materials";

/**
 * Form for user to login. State is managed in and rendered in `SignupAndLogin/index.jsx`
 *
 * @param {*} props - `{ handleChange: (value: string, key: string) => void, handleSubmit: () => void, user: SignupAndLoginState }`
 * @returns {*} ReactElement<any>
 */
const LoginForm = ({ handleChange, handleSubmit, user }) => (
  <MForm
    args={[]}
    // ! better way to tell user of invalid inputs
    disableSubmit={!user.email || !user.password}
    handleSubmit={handleSubmit}
    name="Login"
    redirect="/me"
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <MInput
        args={["email"]}
        handleChange={handleChange}
        isRequired
        name="email" // ! messes up label
        type="email"
      />
      <MInput
        args={["password"]}
        handleChange={handleChange}
        isRequired
        name="password"
        type="password"
      />
    </div>
  </MForm>
);

LoginForm.defaultProps = {
  handleChange: () => {},
  handleSubmit: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: ""
  }
};

LoginForm.propTypes = {
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  user: PropTypes.shape({
    confirmEmail: PropTypes.string,
    confirmPassword: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string
  })
};

export default hot(module)(LoginForm);
