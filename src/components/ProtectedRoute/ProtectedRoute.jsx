import React from "react";
import { Route, Redirect } from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage";
import { useSelector } from "react-redux";

function ProtectedRoute(props) {
  const user = useSelector((store) => store.user);

  // this takes ComponentToProtect from component
  // prop and grabs all other props to pass them along to Route
  const {
    // redirect path to be used if the user is authorized
    authRedirect,
    ...otherProps
  } = props;

  // Component may be passed in as as prop, or as a child
  const ComponentToProtect = props.component || (() => props.children);

  let ComponentToShow;

  if (user.id) {
    // if the user is logged in (only logged in users have ids)
    // show the component that is protected
    ComponentToShow = ComponentToProtect;
  } else {
    // if they are not logged in, check the loginMode on Redux State
    // if the mode is 'login', show the LoginPage
    ComponentToShow = LoginPage;
  }

  // redirect a logged in user if an authRedirect prop has been provided
  if (user.id && authRedirect != null) {
    return <Redirect exact from={otherProps.path} to={authRedirect} />;
  } else if (!user.id && authRedirect != null) {
    ComponentToShow = ComponentToProtect;
  }

  // We return a Route component that gets added to our list of routes
  return (
    <Route
      // all props like 'exact' and 'path' that were passed in
      // are now passed along to the 'Route' Component
      {...otherProps}
    >
      <ComponentToShow />
    </Route>
  );
}

export default ProtectedRoute;
