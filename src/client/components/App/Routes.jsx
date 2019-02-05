import loadable from "@loadable/component";
import PropTypes from "prop-types";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { Landing } from "..";

/**
 * Client-Side Routing (CSR) component. Index of various routes in the app.
 * Receives `userCookie` as props to determine what routes are accessible.
 *
 * @param {*} props - contains `userCookie: Cookie`
 * @returns {*} ReactElement<any>
 */
const Routes = ({ userCookie }) => {
  const LDashboard = loadable(() => import("../Dashboard"));
  const LSignupAndLogin = loadable(() => import("../SignupAndLogin"));

  return (
    <Switch>
      {/* Routes placed here are available to all visitors */}
      <Route exact path="/" component={Landing} />
      {userCookie && (
        <Switch>
          {/* Routes placed here are only available after logging in */}
          <Route path="/me" component={LDashboard} />
        </Switch>
      )}
      {/* Displays our Signup component as a fallback */}
      <Route
        path="/login"
        render={loadable(() => (
          <LSignupAndLogin formType="Login" />
        ))}
      />
      <Route
        path="/signup"
        render={loadable(() => (
          <LSignupAndLogin formType="Signup" />
        ))}
      />
    </Switch>
  );
};

Routes.defaultProps = {
  userCookie: ""
};

Routes.propTypes = {
  userCookie: PropTypes.string
};

export default Routes;
