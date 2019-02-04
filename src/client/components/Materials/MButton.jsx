'use strict'

import PropTypes from 'prop-types';
import React from 'react';

// ! css modules

import history from '../../history';

/**
 * Template for buttons. Supports redirecting pages with prop `redirect`,
 * handling clicks with prop `handleClick` (takes prop `args` as arguments),
 * adding classes with prop `styling` (defaults to `.stdButton`), as well as
 * prop `type` for button type and prop `name` for the name of the button.
 *
 * @param {*} props - contains `args: any[]`, `disabled: boolean`,
 * `handleClick: (...args[]) => void`, `name: string`, `redirect: string`,
 * `styling: string` and `type: string`
 * @returns {*} ReactElement<any>
 */
const MButton = ({
  args,
  disabled,
  handleClick,
  name,
  redirect,
  styling,
  type
}) => (
  <button
    className={`${styling}Button`}
    disabled={disabled}
    onClick={async () => {
      await handleClick(...args);
      if (redirect) history.push(redirect);
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
  name: '',
  styling: 'std',
  type: 'button'
};

MButton.PropTypes = {
  args: PropTypes.array(PropTypes.any),
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  name: PropTypes.string,
  styling: PropTypes.string,
  type: PropTypes.string
}

export default MButton;

