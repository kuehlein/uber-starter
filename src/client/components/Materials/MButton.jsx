/* eslint-disable react/button-has-type */

import PropTypes from "prop-types";
import React from "react";

// ! css modules
import history from "../../history";

/**
 * Template for buttons. Supports redirecting pages with prop `redirect`,
 * handling clicks with prop `handleClick` (takes prop `args` as arguments),
 * adding classes with prop `styling` (defaults to `.stdButton`), as well as
 * prop `type` for button type and prop `name` for the name of the button.
 *
 * @param {*} props - `{ args: any[], disabled: boolean, handleClick: (...args[]) => void, name: string, redirect: string, styling: string, type: string }`
 * @returns {*} ReactElement<any>
 */
const MButton = ({
  args,
  disabled,
  handleClick,
  name,
  redirect,
  styling,
  type = "button"
}) => (
  <button
    className={`${styling}Button`}
    disabled={disabled}
    onClick={async () => {
      await handleClick(...args);
      if (redirect) {
        history.push(redirect);
      }
    }}
    type={type}
    value={name}
  >
    {name}
  </button>
);

MButton.defaultProps = {
  args: [],
  disabled: false,
  handleClick: () => {},
  name: "",
  redirect: "", // ! defaults to empty string: falsy value will not redirect
  styling: "std",
  type: "button"
};

MButton.propTypes = {
  args: PropTypes.array(PropTypes.any),
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  name: PropTypes.string,
  redirect: PropTypes.string,
  styling: PropTypes.oneOf(["std"]), // ! Add more when start to style
  type: PropTypes.oneOf(["button", "submit", "reset"])
};

export default MButton;
