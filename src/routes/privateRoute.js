import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../providers/authProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(AuthContext);

  return <Route {...rest} render={(props) => (token ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default PrivateRoute;
