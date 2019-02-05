import startCase from "lodash/startCase";
import PropTypes from "prop-types";
import React from "react";

// ! css modules
const materials = require("./materials.css");

/**
 * Template for inputs. Supports handling changes with prop `handleClick`
 * (takes prop `args` as arguments), adding classes with prop `styling`
 * (defaults to `.stdInput`), as well as prop `type` for input type,
 * prop `name` for the name of the input, as well as most other input
 * functionality. See @param for a full list.
 *
 * @param {*} props - `{ args: any[], autoComplete: boolean, autoCorrect: boolean, autoFocus: boolean, handleChange: (...args[]) => void, isDisabled: boolean, isReadOnly: boolean, isRequired: boolean, maxLength: number, name: string, placeholder: string, shouldSpellCheck: boolean, styling: string, type: string }`
 * @returns {*} ReactElement<any>
 */
const MInput = ({
  args,
  autoComplete,
  autoCorrect,
  handleChange,
  isDisabled,
  isReadOnly,
  isRequired,
  maxLength,
  minLength,
  name,
  placeholder,
  shouldSpellcheck,
  styling,
  type
  // value
}) => {
  const formattedName = startCase(name);

  return (
    <label htmlFor="input">
      {formattedName}
      <input
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        className={materials[`${styling}Input`]}
        disabled={isDisabled}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        onChange={event => handleChange(event.target.value, ...args)}
        placeholder={placeholder || formattedName}
        readOnly={isReadOnly}
        required={isRequired}
        spellCheck={shouldSpellcheck}
        type={type}
        // value={value} // ! controlled inputs
      />
    </label>
  );
};

MInput.defaultProps = {
  args: [],
  autoComplete: "off",
  autoCorrect: "off",
  handleChange: () => {},
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
  maxLength: Infinity,
  minLength: 0,
  name: "",
  placeholder: "",
  shouldSpellcheck: false,
  styling: "std",
  type: "text"
  // value: ''
};

MInput.propTypes = {
  args: PropTypes.array(PropTypes.any),
  autoComplete: PropTypes.oneOf(["off", "on"]),
  autoCorrect: PropTypes.oneOf(["off", "on"]),
  handleChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shouldSpellcheck: PropTypes.bool,
  styling: PropTypes.oneOf(["std"]), // ! Add more when start to style
  type: PropTypes.oneOf([
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week"
  ])
  // value: PropTypes.string
};

export default MInput;
