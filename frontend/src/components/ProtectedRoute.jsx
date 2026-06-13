import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  return children;
}