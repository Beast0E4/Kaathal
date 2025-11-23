import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute ({ children }) {
  const authState = useSelector((state) => state.auth);

  if (!authState?.isLoggedIn || !authState?.data?.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
