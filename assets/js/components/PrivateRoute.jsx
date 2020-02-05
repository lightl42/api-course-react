import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

// Si je suis authentifie, me redirige vers le bon composant sinon redirige vers la page de login
// Enlever le "return" et les accolades {} a ma fonction si elle ne tient qu'en une seule ligne avec <cond> ? <if_true> : <if_false>
const PrivateRoute = ({ path, component }) => {
    
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Route path={path} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
