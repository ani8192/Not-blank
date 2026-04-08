import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Redux + localStorage sync
  const currentUser = user || storedUser;

  // not logged in
  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // role-based protection
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;