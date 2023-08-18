import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ element: Component, ...rest }) => {
  let { user } = useContext(AuthContext);
  console.log("Private works");
  return (
    <Route {...rest}>{!user ? <Navigate to="/login" /> : <Component />}</Route>
  );
};

export default PrivateRoute;
