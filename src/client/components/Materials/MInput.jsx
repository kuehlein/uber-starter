'use strict'

import startCase from 'lodash/startCase';
import PropTypes from 'prop-types';
import React from 'react';

// ! css modules
const materials = require('./materials.css');

/**
 * Template for inputs. Supports handling changes with prop `handleClick`
 * (takes prop `args` as arguments), adding classes with prop `styling`
 * (defaults to `.stdInput`), as well as prop `type` for input type,
 * prop `name` for the name of the input, as well as most other input
 * functionality. See @param for a full list.
 *
 * @param {*} props - contains `args: any[]`, `autoComplete: boolean`,
 * `autoCorrect: boolean`, `autoFocus: boolean`, `handleChange: (...args[]) => void`,
 * `isDisabled: boolean`, `isReadOnly: boolean`, `isRequired: boolean`,
 * `maxLength: number`, `name: string`, `placeholder: string`, `shouldSpellCheck: boolean`,
 * `styling: string` and `type: string`
 * @returns {*} ReactElement<any>
 */
const MInput = ({
  args,
  autoComplete,
  autoCorrect,
  autoFocus,
  handleChange,
  isDisabled,
  isReadOnly,
  isRequired,
  maxLength,
  name,
  placeholder,
  shouldSpellcheck,
  styling,
  type,
  // value
}) => {
  const formattedName = startCase(name);

  return (
    <label htmlFor="input">
      {formattedName}
      <input
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        className={materials[`${styling}-input`]}
        disabled={isDisabled}
        maxLength={maxLength}
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
  autoComplete: 'off',
  autoCorrect: 'off',
  autoFocus: false,
  handleChange: () => {},
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
  maxLength: Infinity,
  name: '',
  placeholder: '',
  shouldSpellcheck: false,
  styling: 'std',
  type: 'text',
  // value: ''
};

MInput.PropTypes = {
  args: PropTypes.array(PropTypes.any),
  autoComplete: PropTypes.string,
  autoCorrect: PropTypes.string,
  autoFocus: PropTypes.bool,
  handleChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shouldSpellcheck: PropTypes.bool,
  styling: PropTypes.string,
  type: PropTypes.string,
  // value: PropTypes.string
}

export default MInput;
