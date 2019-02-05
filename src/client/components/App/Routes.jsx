import PropTypes from "prop-types";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { Dashboard, Landing, SignupAndLogin } from "..";

/**
 * Client-Side Routing (CSR) component. Index of various routes in the app.
 * Receives `userCookie` as props to determine what routes are accessible.
 *
 * @param {*} props - contains `userCookie: Cookie`
 * @returns {*} ReactElement<any>
 */
const Routes = ({ userCookie }) => (
  <Switch>
    {/* Routes placed here are available to all visitors */}
    <Route exact path="/" component={Landing} />
    {userCookie && (
      <Switch>
        {/* Routes placed here are only available after logging in */}
        <Route path="/me" component={Dashboard} />
      </Switch>
    )}
    {/* Displays our Signup component as a fallback */}
    <Route path="/login" render={() => <SignupAndLogin formType="Login" />} />
    <Route path="/signup" render={() => <SignupAndLogin formType="Signup" />} />
  </Switch>
);

Routes.defaultProps = {
  userCookie: ""
};

Routes.propTypes = {
  userCookie: PropTypes.string
};

export default Routes;
