import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import React from "react";

import { isValid } from "../../../utils";
import { MForm, MInput } from "../Materials";
import { isFormValid } from "./utils";

/**
 * Form for user to signup. State is managed in and rendered in `SignupAndLogin/index.jsx`
 *
 * @param {*} props - `{ handleChange: () => void, handleSubmit: () => void, user: SignupAndLoginState }`
 * @returns {*} ReactElement<any>
 */
const SignupForm = ({ handleChange, handleSubmit, user }) => {
  const debouncedHandleChange = debounce(handleChange, 300);
  const eventHandler = (value, key) => debouncedHandleChange(value, key);

  return (
    <MForm
      args={[]}
      disableSubmit={!isFormValid(user)}
      handleSubmit={handleSubmit}
      name="Signup"
      redirect="/me"
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <MInput
            args={["email"]}
            handleChange={eventHandler}
            isRequired
            name="email"
            styling={
              isValid.email(user.email) || !user.email ? "std" : "invalid"
            }
            type="email"
          />
          <MInput
            args={["password"]}
            handleChange={eventHandler}
            isRequired
            name="password"
            styling={
              isValid.password(user.password) || !user.password
                ? "std"
                : "invalid"
            }
            type="password"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <MInput
            args={["confirmEmail"]}
            handleChange={eventHandler}
            isRequired
            name="confirmEmail"
            style={user.email === user.confirmEmail ? "std" : "invalid"}
            type="email"
          />
          <MInput
            args={["confirmPassword"]}
            handleChange={eventHandler}
            isRequired
            name="confirmPassword" // ! password
            styling={user.password === user.confirmPassword ? "std" : "invalid"}
            type="password"
          />
        </div>
      </div>
    </MForm>
  );
};

SignupForm.defaultProps = {
  handleChange: () => {},
  handleSubmit: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: ""
  }
};

SignupForm.propTypes = {
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  user: PropTypes.shape({
    confirmEmail: PropTypes.string,
    confirmPassword: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string
  })
};

export default SignupForm;
