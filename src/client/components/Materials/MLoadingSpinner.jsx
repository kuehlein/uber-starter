import PropTypes from "prop-types";
import React from "react";

// ! flesh out more / style

/**
 * Loading spinner. Used in conjunction with `react-loadable`
 *
 * @param {*} props - `{ error: any, isLoading: boolean, pastDelay: boolean }`
 * @returns {*} ReactElement<any>
 */
const Loading = ({ error, isLoading, pastDelay }) => {
  if (isLoading && pastDelay) return <p>Loading...</p>;
  if (error && !isLoading) return <p>Error!</p>;
  return null;
};

Loading.defaultProps = {
  error: "",
  isLoading: false,
  pastDelay: false
};

Loading.propTypes = {
  error: PropTypes.any,
  isLoading: PropTypes.bool,
  pastDelay: PropTypes.bool
};

export default Loading;
