import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, accessToken } = useSelector((state) => state.auth);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const currentUser = user || storedUser;

  if (!accessToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
