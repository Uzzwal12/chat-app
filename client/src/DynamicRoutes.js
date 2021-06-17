import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthState } from "./Context/auth";

export default function DynamicRoute(props) {
  const { user } = useAuthState();

  if (props.auth && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route component={props.component} {...props} />;
  }
}
