// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../Data/local/tokenUtils'; // adjust path

const ProtectedRoute = () => {
  const token = getAccessToken();

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
