import React from "react";
import { Redirect, Route } from "react-router-dom";
import { withUser } from "./Auth/withUser";

const ProtectedAdminRoute = ({ component: Component, context, ...rest }) => {
  if (context.isLoading) {
    return null;
  } else if (context.isMob) {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else {
    return <Redirect to="/signin" />;
  }
};

export default withUser(ProtectedAdminRoute);
