import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

import logo from "../../../../public/assets/Uber-logo.png";
import { MButton } from "../Materials";

/**
 * Navbar. Rendered at the top of the main `App` component. Receives `userCookie`
 * as props to determine what navigation options are available.
 *
 * @param {*} props - contains `handleLogout: () => void` and `userCookie: Cookie`
 * @returns {*} ReactElement<any>
 */
const Navbar = ({ handleLogout, userCookie }) => (
  <div>
    <h2>
      <Link to="/">{logo}</Link>
    </h2>
    {!userCookie ? (
      <div>
        <MButton
          disabled={window.location.pathname === "/signup"}
          name="Signup"
          redirect="signup"
        />
        <MButton
          disabled={window.location.pathname === "/login"}
          name="Login"
          redirect="login"
        />
      </div>
    ) : (
      /* this was previously apollo */
      <MButton
        args={[]} // ! used to be client for apollo
        handleClick={handleLogout}
        name="Logout"
        redirect="/"
      />
    )}
  </div>
);

Navbar.defaultProps = {
  handleLogout: () => {},
  userCookie: ""
};

Navbar.propTypes = {
  handleLogout: PropTypes.func,
  userCookie: PropTypes.string
};

export default Navbar;
