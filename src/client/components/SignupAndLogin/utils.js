import { isValid } from "../../../utils";

/**
 * Validation utility to make sure that form inputs are valid before submission.
 *
 * @param {*} SignupAndLoginState
 * @returns {boolean} `boolean`
 */
export const isFormValid = user =>
  user.email === user.confirmEmail &&
  user.password === user.confirmPassword &&
  isValid.email(user.email) &&
  isValid.password(user.password);
