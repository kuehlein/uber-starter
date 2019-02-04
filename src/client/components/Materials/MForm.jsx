'use strict'

import startCase from 'lodash/startCase'
import PropTypes from 'prop-types'
import React from 'react'

// ! css modules

import { MButton } from './index'

/**
 * Template for forms. Supports redirecting after submit with prop `redirect`
 * (form will not redirect by default). handling submit with prop `handleSubmit`
 * (takes prop `args` as arguments), adding classes with prop `styling`
 * (defaults to `.stdForm`), as well as prop `disableSubmit` for controlling
 * submission and prop `name` for the name of the form.
 *
 * @param {*} props - contains `args: any[]`, `children: ReactElement<any>`,
 * `disableSubmit: boolean`, `handleSubmit: (...args[]) => void`, `name: string`,
 * `redirect: string` and `styling: string`.
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
    <form className={`${styling}-form`}>
      <label>
        <h2>{startCase(name)}</h2>
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
  )
}

MForm.defaultProps = {
  args: [],
  disableSubmit: false,
  handleSubmit: () => {},
  name: '',
  redirect: '', // ! defaults to empty string: falsy value will not redirect
  styling: 'std'
}

MForm.PropTypes = {
  args: PropTypes.array(PropTypes.any),
  disableSubmit: PropTypes.bool,
  handleSubmit: PropTypes.func,
  name: PropTypes.string,
  redirect: PropTypes.string,
  styling: PropTypes.string
}

export default MForm

