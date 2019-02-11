import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

// ! css modules
import { MButton } from "./index";

/**
 * Template for forms. Supports redirecting after submit with prop `redirect`
 * (form will not redirect by default). handling submit with prop `handleSubmit`
 * (takes prop `args` as arguments), adding classes with prop `styling`
 * (defaults to `.stdForm`), as well as prop `disableSubmit` for controlling
 * submission and prop `name` for the name of the form.
 *
 * @param {*} props - `{ args: any[], children: ReactElement<any>, disableSubmit: boolean`, `handleSubmit: (...args[]) => void, name: string, redirect: string, styling: string }`
 * @returns {*} ReactElement<any>
 */
const MForm = ({
  args,
  children,
  disableSubmit,
  handleSubmit,
  name,
  redirect,
  styling
}) => {
  return (
    <form className={`${styling}Form`}>
      <label htmlFor={name}>
        <h2>{_.startCase(name)}</h2>
      </label>

      {/* fields/inputs/etc. that Form will contain */}
      {children}

      <MButton
        args={args}
        disabled={disableSubmit}
        handleClick={handleSubmit}
        name="Submit"
        styling="submit"
        redirect={redirect}
      />
    </form>
  );
};

MForm.defaultProps = {
  args: [],
  children: <div />,
  disableSubmit: false,
  handleSubmit: () => {},
  name: "",
  redirect: "", // ! defaults to empty string: falsy value will not redirect
  styling: "std"
};

MForm.propTypes = {
  args: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.any, // ! PropTypes.element
  disableSubmit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  name: PropTypes.string,
  redirect: PropTypes.string,
  styling: PropTypes.oneOf(["std"]) // ! Add more when start to style
};

export default MForm;
