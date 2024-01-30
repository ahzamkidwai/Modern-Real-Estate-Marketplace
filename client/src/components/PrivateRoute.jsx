import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

// useNavigate is a hook while Navigate is a component

function PrivateRoute() {
  const currentUser = useSelector((state) => state.user);
  console.log("PrivateRoute mei hain hum aur currentUser hain : ", currentUser);
  return currentUser.currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
